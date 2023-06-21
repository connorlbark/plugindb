import React, { useEffect } from 'react';

import {
  Tag
} from '../../types';
import { TagAPI } from '../../utils/service';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { tagFormPageName } from '../../pages/TagForm';

export const TagTable = (props: {redirect: (page: string, props?: {}) => void}) => {
  const [data, setData] = React.useState<Tag[]>([]);

  const init = () => {
    TagAPI.getAll().then((tags) => {
      setData(tags);
    }).catch((e) => {
      alert("Could not access API: " + e);
    });
  }

  const columns: GridColDef[] = [
    { field: 'tag', headerName: 'Tag', width: 150 },
    { 
      field: 'color',
      headerName: 'Color',
      width: 100,
      renderCell: (params) => {
        return (
          <div style={{backgroundColor: params.value, width: 100, height: 20}} />
        )
      }
    },
    {
      field: "Actions",
      renderCell: (params) => {
        return (
          <div>
            <button className="button-link" onClick={() => {props.redirect(tagFormPageName, { initialTag: params.row })}}>
              <ModeEditIcon />
            </button>
            <button className="button-link" onClick={async () => {await TagAPI.delete(params.row.tag); init()}}>
              <DeleteIcon />
            </button>
          </div>
        );
      },
      disableExport: true,
      sortable: false,
      filterable: false
    }
  ];

  useEffect(() => {
    init();
  }, []);

  return (
    <div style={{ height: 667, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.tag}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}       
        slots={{ toolbar: GridToolbar }}    
      />
    </div>
  );

};

export default TagTable;
