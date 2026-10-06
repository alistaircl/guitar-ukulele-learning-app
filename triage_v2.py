#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys

def run_cmd(cmd):
    """Run a command and return (output, exit_code)."""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=False)
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        return '', str(e), 1

def get_repo():
    """Get owner/repo from git remote origin."""
    stdout, stderr, rc = run_cmd('git remote get-url origin')
    if rc != 0:
        return None, f'Failed to get git remote origin: {stderr}'
    # Handle various remote formats
    match = re.search(r'github.com[:/]([^/]+)/([^/]+?)(?:\.git|/$)', stdout.strip())
    if not match:
        return None, f'Could not parse remote URL: {stdout}'
    owner, repo = match.group(1), match.group(2)
    return f'{owner}/{repo}', None

def list_issues(repo, label=None):
    """List open issues, optionally filtered by label."""
    if label:
        cmd = f'gh issue list --repo {repo} --label "{label}" --state open --json number,title,body,labels,assignees'
    else:
        cmd = f'gh issue list --repo {repo} --state open --json number,title,body,labels,assignees'
    stdout, stderr, rc = run_cmd(cmd)
    if rc != 0:
        return None, f'Failed to list issues: {stderr}'
    try:
        data = json.loads(stdout)
        return data, None
    except json.JSONDecodeError as e:
        return None, f'Failed to parse JSON: {e}'

def analyze_issue(issue):
    """Analyze issue to determine labels, priority, assignee."""
    title = issue.get('title', '').lower()
    body = issue.get('body', '').lower()
    labels = [l.get('name', '').lower() for l in issue.get('labels', [])]
    assignees = [a.get('login') for a in issue.get('assignees', [])]
    
    # Determine type
    issue_type = 'other'
    if any(k in title or k in body for k in ['bug', 'error', 'fix', 'broken', 'crash']):
        issue_type = 'bug'
    elif any(k in title or k in body for k in ['feature', 'enhancement', 'add', 'implement', 'new']):
        issue_type = 'enhancement'
    elif 'question' in title or '?' in title:
        issue_type = 'question'
    
    # Determine priority (simple heuristic)
    priority = 'priority-medium'
    if any(k in title or k in body for k in ['urgent', 'critical', 'blocker', 'high priority']):
        priority = 'priority-high'
    elif any(k in title or k in body for k in ['low', 'minor', 'trivial']):
        priority = 'priority-low'
    
    # Determine assignee (if not already assigned and we can infer)
    assignee = None
    if not assignees:
        # Look for @username in body
        matches = re.findall(r'@([a-zA-Z0-9_-]+)', body)
        if matches:
            # Take the first mentioned user that's not a bot
            for m in matches:
                if not m.endswith('[bot]'):
                    assignee = m
                    break
    
    return {
        'type': issue_type,
        'priority': priority,
        'assignee': assignee,
        'current_labels': labels,
        'current_assignees': assignees
    }

def apply_triage(repo, issue_number, analysis):
    """Apply labels, assignee, and comment to issue."""
    # Prepare label changes
    add_labels = []
    remove_labels = ['needs-triage']  # always remove this
    
    # Add type label if not present
    type_label = analysis['type']
    if type_label not in analysis['current_labels']:
        add_labels.append(type_label)
    
    # Add priority label if not present
    priority_label = analysis['priority']
    if priority_label not in analysis['current_labels']:
        add_labels.append(priority_label)
    
    # Apply labels
    if add_labels:
        cmd = f'gh issue edit {issue_number} --repo {repo} --add-label {",".join(add_labels)} --remove-label {",".join(remove_labels)}'
        stdout, stderr, rc = run_cmd(cmd)
        if rc != 0:
            return False, f'Failed to apply labels: {stderr}'
    
    # Apply assignee if determined and not already assigned
    assignee = analysis['assignee']
    if assignee and assignee not in analysis['current_assignees']:
        cmd = f'gh issue edit {issue_number} --repo {repo} --assignee {assignee}'
        stdout, stderr, rc = run_cmd(cmd)
        if rc != 0:
            return False, f'Failed to assign {assignee}: {stderr}'
    
    # Add triage comment
    comment = f'''## Triage Complete
- **Type**: {analysis['type'].title()}
- **Priority**: {analysis['priority'].replace('priority-', '').title()}
- **Assignee**: {assignee or 'None (not determined)'}'''
    cmd = f'gh issue comment {issue_number} --repo {repo} --body {json.dumps(comment)}'
    stdout, stderr, rc = run_cmd(cmd)
    if rc != 0:
        return False, f'Failed to add comment: {stderr}'
    
    return True, 'Success'

def main():
    # Initialize counters
    stats = {
        'total_open_issues': 0,
        'issues_needing_triage': 0,
        'reviewed': 0,
        'triaged': 0,
        'labels_added': {},
        'assignments_made': 0,
        'errors': []
    }
    
    # Get repository
    repo, error = get_repo()
    if error:
        stats['errors'].append(f'Repository detection: {error}')
        print(json.dumps(stats))
        return
    
    # List all open issues
    all_issues, error = list_issues(repo)
    if error:
        stats['errors'].append(f'Listing all open issues: {error}')
        print(json.dumps(stats))
        return
    stats['total_open_issues'] = len(all_issues)
    
    # List issues needing triage (label: needs-triage)
    triage_issues, error = list_issues(repo, label='needs-triage')
    if error:
        stats['errors'].append(f'Listing issues with needs-triage: {error}')
        print(json.dumps(stats))
        return
    stats['issues_needing_triage'] = len(triage_issues)
    stats['reviewed'] = len(triage_issues)
    
    # Process each issue needing triage
    for issue in triage_issues:
        issue_number = issue.get('number')
        if not issue_number:
            continue
        
        try:
            analysis = analyze_issue(issue)
            success, msg = apply_triage(repo, issue_number, analysis)
            if success:
                stats['triaged'] += 1
                # Track labels added
                for label in [analysis['type'], analysis['priority']]:
                    stats['labels_added'][label] = stats['labels_added'].get(label, 0) + 1
                if analysis['assignee']:
                    stats['assignments_made'] += 1
            else:
                stats['errors'].append(f'Issue #{issue_number}: {msg}')
        except Exception as e:
            stats['errors'].append(f'Issue #{issue_number}: {str(e)}')
    
    # Output summary as JSON
    print(json.dumps(stats, indent=2))

if __name__ == '__main__':
    main()
