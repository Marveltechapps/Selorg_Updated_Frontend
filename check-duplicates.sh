#!/bin/bash

# Duplicate Identifier Checker Script
# Scans React Native codebase for duplicate function/variable declarations

echo "🔍 Checking for duplicate identifiers..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Find all TypeScript/JavaScript files
FILES=$(find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) ! -path "*/node_modules/*" ! -path "*/build/*")

DUPLICATES_FOUND=0

for file in $FILES; do
    # Extract all const/function declarations
    # Pattern matches: const identifier = or function identifier
    DECLARATIONS=$(grep -E "^\s*(const|function|let|var)\s+[a-zA-Z_][a-zA-Z0-9_]*" "$file" 2>/dev/null | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*=.*$//' | sed 's/^const[[:space:]]*//' | sed 's/^function[[:space:]]*//' | sed 's/^let[[:space:]]*//' | sed 's/^var[[:space:]]*//' | sed 's/(.*$//')
    
    if [ -z "$DECLARATIONS" ]; then
        continue
    fi
    
    # Count occurrences of each identifier
    UNIQUE_IDS=$(echo "$DECLARATIONS" | sort | uniq)
    DUPLICATES=""
    
    for id in $UNIQUE_IDS; do
        COUNT=$(echo "$DECLARATIONS" | grep -c "^${id}$" || echo "0")
        if [ "$COUNT" -gt 1 ]; then
            DUPLICATES="${DUPLICATES}${id} (${COUNT}x)\n"
        fi
    done
    
    if [ ! -z "$DUPLICATES" ]; then
        echo -e "${RED}❌ Duplicates found in: ${file}${NC}"
        echo -e "${YELLOW}$(echo -e "$DUPLICATES" | sed 's/^/   - /')${NC}"
        echo ""
        DUPLICATES_FOUND=1
    fi
done

if [ $DUPLICATES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No duplicate identifiers found!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Duplicate identifiers detected. Please fix before committing.${NC}"
    exit 1
fi

