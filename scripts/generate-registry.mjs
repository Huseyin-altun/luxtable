/**
 * LuxTable Registry Generator
 * 
 * shadcn CLI için resmi registry-item.json formatına uygun
 * registry JSON dosyaları oluşturur.
 * 
 * @see https://ui.shadcn.com/docs/registry/registry-item-json
 * 
 * Usage: node scripts/generate-registry.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PACKAGES_DIR = join(__dirname, '..', 'packages', 'luxtable', 'src');
const OUTPUT_DIRS = [
    join(__dirname, '..', 'apps', 'docs', 'public', 'r'),
    join(__dirname, '..', 'packages', 'luxtable', 'registry'),
];

// Ensure output directories exist
for (const dir of OUTPUT_DIRS) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}

/**
 * Read file content and normalize line endings
 */
function readFileContent(filePath) {
    const content = readFileSync(filePath, 'utf-8');
    return content.replace(/\r\n/g, '\n');
}

/**
 * Fix imports for shadcn project structure
 * Converts relative imports to @/ alias imports
 */
function transformImports(content) {
    return content
        // lib/utils
        .replace(/from ["']\.\.\/\.\.\/lib\/utils["']/g, 'from "@/lib/utils"')
        .replace(/from ["']\.\.\/lib\/utils["']/g, 'from "@/lib/utils"')
        // UI components
        .replace(/from ["']\.\.\/ui\//g, 'from "@/components/ui/')
        .replace(/from ["']\.\/\.\.\/ui\//g, 'from "@/components/ui/')
        // Table primitives
        .replace(/from ["']\.\.\/table\/table["']/g, 'from "@/components/table/table"')
        .replace(/from ["']\.\.\/table["']/g, 'from "@/components/table"')
        // Internal lux-table imports
        .replace(/from ["']\.\/types["']/g, 'from "@/components/lux-table/types"')
        .replace(/from ["']\.\/column-filter["']/g, 'from "@/components/lux-table/column-filter"')
        .replace(/from ["']\.\/pagination["']/g, 'from "@/components/lux-table/pagination"')
        .replace(/from ["']\.\/table-toolbar["']/g, 'from "@/components/lux-table/table-toolbar"');
}

/**
 * Create a file entry for the registry
 */
function createFileEntry(srcPath, targetPath, type = 'registry:component') {
    const fullPath = join(PACKAGES_DIR, srcPath);
    if (!existsSync(fullPath)) {
        console.warn(`⚠️  File not found: ${srcPath}`);
        return null;
    }

    const content = transformImports(readFileContent(fullPath));

    return {
        path: srcPath,
        content,
        type,
        target: targetPath,
    };
}

/**
 * Write registry to all output directories
 */
function writeRegistry(filename, data) {
    const json = JSON.stringify(data, null, 2);
    for (const dir of OUTPUT_DIRS) {
        writeFileSync(join(dir, filename), json);
    }
}

/**
 * Generate main LuxTable registry
 */
function generateLuxTableRegistry() {
    const files = [
        createFileEntry(
            'components/lux-table/lux-table.tsx',
            'components/lux-table/lux-table.tsx',
            'registry:component'
        ),
        createFileEntry(
            'components/lux-table/types.ts',
            'components/lux-table/types.ts',
            'registry:component'
        ),
        createFileEntry(
            'components/lux-table/column-filter.tsx',
            'components/lux-table/column-filter.tsx',
            'registry:component'
        ),
        createFileEntry(
            'components/lux-table/column-header.tsx',
            'components/lux-table/column-header.tsx',
            'registry:component'
        ),
        createFileEntry(
            'components/lux-table/pagination.tsx',
            'components/lux-table/pagination.tsx',
            'registry:component'
        ),
        createFileEntry(
            'components/lux-table/table-toolbar.tsx',
            'components/lux-table/table-toolbar.tsx',
            'registry:component'
        ),
        createFileEntry(
            'components/table/table.tsx',
            'components/table/table.tsx',
            'registry:component'
        ),
    ].filter(Boolean);

    const registry = {
        $schema: 'https://ui.shadcn.com/schema/registry-item.json',
        name: 'lux-table',
        type: 'registry:block',
        title: 'LuxTable',
        description: 'Enterprise-Grade Data Table component with sorting, filtering, pagination, and row selection. Built on TanStack Table.',
        author: 'LuxTable <https://luxtable.dev>',
        dependencies: [
            '@tanstack/react-table',
            'lucide-react',
            'clsx',
            'tailwind-merge',
        ],
        registryDependencies: [
            'button',
            'checkbox',
            'dropdown-menu',
            'input',
            'select',
        ],
        categories: ['table', 'data-display'],
        docs: 'Visit https://luxtable.dev/docs for full documentation and examples.',
        files,
    };

    writeRegistry('lux-table.json', registry);
    console.log('✅ Generated: lux-table.json');
}

/**
 * Generate Cell Renderers registry
 */
function generateCellRenderersRegistry() {
    const cellFiles = [
        'status-cell.tsx',
        'progress-cell.tsx',
        'date-cell.tsx',
        'copyable-cell.tsx',
        'currency-cell.tsx',
        'boolean-cell.tsx',
        'index.ts',
    ];

    const files = cellFiles.map(file => {
        const entry = createFileEntry(
            `components/cell-renderers/${file}`,
            `components/lux-table/cell-renderers/${file}`,
            file === 'index.ts' ? 'registry:lib' : 'registry:component'
        );

        // Fix index.ts exports
        if (entry && file === 'index.ts') {
            entry.content = entry.content.replace(
                /from ["']\.\//g,
                'from "@/components/lux-table/cell-renderers/'
            );
        }

        return entry;
    }).filter(Boolean);

    const registry = {
        $schema: 'https://ui.shadcn.com/schema/registry-item.json',
        name: 'lux-table-cell-renderers',
        type: 'registry:component',
        title: 'LuxTable Cell Renderers',
        description: 'Pre-built cell renderers for common data types: status badges, progress bars, dates, copyable text, currency, and booleans.',
        author: 'LuxTable <https://luxtable.dev>',
        dependencies: [
            'lucide-react',
        ],
        registryDependencies: [],
        categories: ['table', 'data-display'],
        files,
    };

    writeRegistry('lux-table-cell-renderers.json', registry);
    console.log('✅ Generated: lux-table-cell-renderers.json');
}

/**
 * Generate Column Helper registry
 */
function generateColumnHelperRegistry() {
    const files = [
        createFileEntry(
            'lib/column-helper.tsx',
            'lib/column-helper.tsx',
            'registry:lib'
        ),
    ].filter(Boolean);

    const registry = {
        $schema: 'https://ui.shadcn.com/schema/registry-item.json',
        name: 'lux-table-column-helper',
        type: 'registry:lib',
        title: 'LuxTable Column Helper',
        description: 'Type-safe column definition helper with built-in support for common patterns like accessor, display, and action columns.',
        author: 'LuxTable <https://luxtable.dev>',
        dependencies: [
            '@tanstack/react-table',
        ],
        registryDependencies: [
            'https://unpkg.com/luxtable/registry/lux-table.json',
        ],
        categories: ['table', 'utility'],
        files,
    };

    writeRegistry('lux-table-column-helper.json', registry);
    console.log('✅ Generated: lux-table-column-helper.json');
}

// Run generators
console.log('\n🔧 Generating LuxTable Registry Files...\n');
console.log('📋 Following shadcn registry-item.json specification');
console.log('   https://ui.shadcn.com/docs/registry/registry-item-json\n');

generateLuxTableRegistry();
generateCellRenderersRegistry();
generateColumnHelperRegistry();

console.log('\n✨ Registry generation complete!\n');
console.log('📦 Output directories:');
OUTPUT_DIRS.forEach(dir => console.log(`   - ${dir}`));
console.log('\n🚀 Users can now install with:\n');
console.log('   # Via unpkg (npm CDN):');
console.log('   pnpm dlx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table.json"');
console.log('   pnpm dlx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table-cell-renderers.json"');
console.log('   pnpm dlx shadcn@latest add "https://unpkg.com/luxtable/registry/lux-table-column-helper.json"');
console.log('\n   # Via docs site (when deployed):');
console.log('   pnpm dlx shadcn@latest add "https://luxtable.dev/r/lux-table.json"\n');
