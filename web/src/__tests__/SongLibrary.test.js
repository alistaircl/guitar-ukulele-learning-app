
import { render } from '@testing-library/react';
import SongLibrary from '../components/SongLibrary';

test('renders SongLibrary without crashing', () => {
  render(<SongLibrary />);
  // We can add more specific assertions here
});
