#!/bin/bash

# Script to generate all app icon sizes from a source image
# Usage: ./generate-icons.sh "/path/to/source/logo.png"

SOURCE_IMAGE="/Users/muthuramanveerashekar/Downloads/Square logo ( 512 _ 512) (1).png"
TEMP_DIR="/tmp/selorg-icons-$$"
mkdir -p "$TEMP_DIR"

echo "Generating app icons from source image..."
echo "Source: $SOURCE_IMAGE"
echo ""

# Function to resize image using sips
resize_image() {
    local size=$1
    local output=$2
    sips -z $size $size "$SOURCE_IMAGE" --out "$output" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ Generated ${size}x${size}"
    else
        echo "✗ Failed to generate ${size}x${size}"
    fi
}

# Generate iOS icons
echo "Generating iOS icons..."
IOS_DIR="$TEMP_DIR/ios"
mkdir -p "$IOS_DIR"

# iOS required sizes
resize_image 40 "$IOS_DIR/icon-20@2x.png"      # 20pt @2x
resize_image 60 "$IOS_DIR/icon-20@3x.png"      # 20pt @3x
resize_image 58 "$IOS_DIR/icon-29@2x.png"      # 29pt @2x
resize_image 87 "$IOS_DIR/icon-29@3x.png"      # 29pt @3x
resize_image 80 "$IOS_DIR/icon-40@2x.png"      # 40pt @2x
resize_image 120 "$IOS_DIR/icon-40@3x.png"     # 40pt @3x
resize_image 120 "$IOS_DIR/icon-60@2x.png"     # 60pt @2x
resize_image 180 "$IOS_DIR/icon-60@3x.png"     # 60pt @3x
resize_image 1024 "$IOS_DIR/icon-1024.png"     # App Store

echo ""
echo "Generating Android icons..."
ANDROID_DIR="$TEMP_DIR/android"
mkdir -p "$ANDROID_DIR"

# Android required sizes
resize_image 48 "$ANDROID_DIR/ic_launcher-mdpi.png"
resize_image 72 "$ANDROID_DIR/ic_launcher-hdpi.png"
resize_image 96 "$ANDROID_DIR/ic_launcher-xhdpi.png"
resize_image 144 "$ANDROID_DIR/ic_launcher-xxhdpi.png"
resize_image 192 "$ANDROID_DIR/ic_launcher-xxxhdpi.png"

# Create round versions (same as square for now, Android will handle rounding)
cp "$ANDROID_DIR/ic_launcher-mdpi.png" "$ANDROID_DIR/ic_launcher_round-mdpi.png"
cp "$ANDROID_DIR/ic_launcher-hdpi.png" "$ANDROID_DIR/ic_launcher_round-hdpi.png"
cp "$ANDROID_DIR/ic_launcher-xhdpi.png" "$ANDROID_DIR/ic_launcher_round-xhdpi.png"
cp "$ANDROID_DIR/ic_launcher-xxhdpi.png" "$ANDROID_DIR/ic_launcher_round-xxhdpi.png"
cp "$ANDROID_DIR/ic_launcher-xxxhdpi.png" "$ANDROID_DIR/ic_launcher_round-xxxhdpi.png"

echo ""
echo "Icons generated in: $TEMP_DIR"
echo ""
echo "Next: Copy icons to app directories"

