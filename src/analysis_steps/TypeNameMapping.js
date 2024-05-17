export function typeToName(type) {
    switch (type) {
        case 'boxplot':
            return 'Boxplot'
        case 'filter':
            return 'Filter rows'
        case 'group-filter':
            return 'Filter on valid'
        case 'imputation':
            return 'Imputation'
        case 'initial-result':
            return 'Initial result'
        case 'log-transformation':
            return "Log transformation"
        case "normalization":
            return 'Normalization'
        case "order-columns":
            return 'Order columns'
        case 'pca':
            return 'PCA'
        case 'umap':
            return 'UMAP'
        case "remove-columns":
            return "Remove columns"
        case 'remove-imputed':
            return 'Remove imputed'
        case 'rename-columns':
            return 'Rename headers'
        case 'scatter-plot':
            return 'Scatter plot'
        case 'summary-stat':
            return 'Summary'
        case 't-test':
            return 't-test'
        case 'volcano-plot':
            return 'Volcano plot'
        case 'add-column':
            return 'Add column'
        case 'one-d-enrichment':
            return '1D Enrichment'
        default: return "Missing type: [" + type + "]?!"
    }
}