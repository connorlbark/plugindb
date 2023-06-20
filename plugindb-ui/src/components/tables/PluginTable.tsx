import React, { useEffect } from 'react';

import {
  MusicPlugin, Tag
} from '../../types';
import { PluginAPI } from '../../utils/service';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { TagChip } from '../TagChip';



export const PluginTable = () => {
  const [data, setData] = React.useState<MusicPlugin[]>([]);

  const init = () => {
    PluginAPI.getAll().then((plugins) => {
      setData(plugins);
    }).catch((e) => {
      alert("Could not access API: " + e);
    });
  }

  const columns: GridColDef[] = [
    { field: 'plugin_id', headerName: 'Plugin ID', width: 70 },
    { field: 'name', headerName: 'Plugin', width: 130 },
    { field: 'developer', headerName: 'Developer', width: 130 },
    { field: 'version', headerName: 'Version', width: 70},
    { 
      field: 'tags',
      headerName: 'Tags',
      width: 300,
      renderCell: (params) => {
        return <div style={{overflow: 'scroll'}}>
          {params.row.tags.map((tag: Tag) => {
            return <TagChip key={tag.tag} tag={tag}/>
          })}
        </div>
      }
    }
  ];

  useEffect(() => {
    init();
  }, []);


    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.plugin_id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          
        />
      </div>
    );

};

export default PluginTable;
