import { DataGrid } from '@mui/x-data-grid';
import type { DataGridProps, GridValidRowModel } from '@mui/x-data-grid';

type DataTableProps<R extends GridValidRowModel> = Pick<DataGridProps<R>, 'rows' | 'columns'>;

export default function DataTable<R extends GridValidRowModel>({ rows, columns }: DataTableProps<R>) {
    return (
        <div style={{ width: '100%', height: 600, padding: '16px' }}>
            {/* OSA 1: Yhteinen taulukko listoille, tästä saa lajittelun ja haun. */}
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
                showToolbar
                disableColumnFilter
                slotProps={{
                    columnsManagement: {
                        getTogglableColumns: (gridColumns) =>
                            gridColumns.filter((column) => column.field !== 'actions').map((column) => column.field),
                    },
                    toolbar: {
                        csvOptions: { disableToolbarButton: true },
                        printOptions: { disableToolbarButton: true },
                    },
                }}
                disableRowSelectionOnClick
            />
        </div>
    );
}