#!/bin/bash
echo "Current directory: $(pwd)"
echo "Listing current directory:"
ls -la
echo ""
echo "Checking if public directory exists:"
if [ -d "public" ]; then
    echo "public directory exists"
    echo "Contents of public directory:"
    ls -la public/
    echo ""
    echo "Checking if index.html exists:"
    if [ -f "public/index.html" ]; then
        echo "index.html exists"
        echo "File size: $(wc -c < public/index.html) bytes"
    else
        echo "index.html does not exist"
    fi
else
    echo "public directory does not exist"
fi
echo ""
echo "Running npm run build..."
npm run build
