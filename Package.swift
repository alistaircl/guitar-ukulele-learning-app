
// swift-tools-version:5.5
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "GuitarUkuleleTuner",
    platforms: [
       .iOS(.v15)
    ],
    products: [
        .executable(
            name: "GuitarUkuleleTuner",
            targets: ["GuitarUkuleleTuner"]),
    ],
    dependencies: [
        .package(url: "https://github.com/AudioKit/AudioKit.git", .upToNextMajor(from: "5.0.0"))
    ],
    targets: [
        .target(
            name: "GuitarUkuleleTuner",
            dependencies: [
                .product(name: "AudioKit", package: "AudioKit"),
                .product(name: "AudioKitEX", package: "AudioKit"),
                .product(name: "AudioKitUI", package: "AudioKit")
            ],
            path: "GuitarUkuleleTuner"),
        .testTarget(
            name: "GuitarUkuleleTunerTests",
            dependencies: ["GuitarUkuleleTuner"],
            path: "GuitarUkuleleTunerTests")
    ]
)
