#!/usr/bin/env python3
import shutil
import sys

source = r'd:\Programming\TripleGates\Code\WafaWebsite-landing\src\v.1.1\css\style.css'
dest = r'd:\Programming\TripleGates\Code\WafaWebsite-landing\css\style.css'

try:
    # Copy the file
    shutil.copy2(source, dest)
    print('✓ File copied successfully')
    
    # Verify the first 5 lines
    with open(dest, 'r', encoding='utf-8') as f:
        lines = [f.readline() for _ in range(5)]
    
    print('\nFirst 5 lines of destination file:')
    for i, line in enumerate(lines, 1):
        print(f'{i}. {line.rstrip()}')
    
    # Check if it starts with the expected comment
    if lines[0].strip().startswith('/*'):
        print('\n✓ Verification successful - file starts with expected CSS comment')
    else:
        print('\n✗ Verification failed - unexpected file content')
        sys.exit(1)
        
except Exception as e:
    print(f'✗ Error: {e}', file=sys.stderr)
    sys.exit(1)
