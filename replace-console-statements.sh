#!/bin/bash
# Script to replace console statements with logger
# This is a helper - actual replacements done via search_replace tool

echo "Console statement replacement progress:"
echo "Files fixed so far: ~20"
echo "Files remaining: 46"
echo ""
echo "Remaining files:"
grep -r "console\.\(log\|warn\|error\)" src/ --include="*.ts" --include="*.tsx" | grep -v "logger.ts" | cut -d: -f1 | sort -u | wc -l

