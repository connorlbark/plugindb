import React, { useEffect } from 'react';

import {
  MusicPlugin, Tag
} from '../../types';
import { PluginAPI } from '../../utils/service';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { TagChip } from '../TagChip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { pluginFormPageName } from '../../pages/PluginForm';
import DeleteIcon from '@mui/icons-material/Delete';
import { pluginPageName } from '../../pages/Plugins';

export const PluginTable = (props: {redirect: (page: string, props?: {}) => void}) => {
  const [data, setData] = React.useState<MusicPlugin[]>([]);

  const init = () => {
    PluginAPI.getAll().then((plugins) => {
      setData(plugins);
    }).catch((e) => {
      alert("Could not access API: " + e);
    });
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Plugin', width: 130 },
    { field: 'developer', headerName: 'Developer', width: 130 },
    { field: 'version', headerName: 'Version', width: 70},
    { 
      field: 'tags',
      headerName: 'Tags',
      width: 300,
      valueGetter: (params) => {
        return params.row.tags.map((t: Tag) => t.tag).join(', ');
      },
      renderCell: (params) => {
        return <div style={{overflow: 'scroll', flex: 'row'}} className="tag-chip-row">
          {params.row.tags.map((tag: Tag) => {
            return <TagChip key={tag.tag} tag={tag}/>
          })}
        </div>
      }
    },
    {
      field: "Actions",
      renderCell: (params) => {
        return (
          <div>
            <button className="button-link" onClick={() => {props.redirect(pluginFormPageName, { initialPlugin: params.row })}}>
              <ModeEditIcon />
            </button>
            <button className="button-link" onClick={async () => {await PluginAPI.delete(params.row.plugin_id); init()}}>
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
        getRowId={(row) => row.plugin_id}
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

export default PluginTable;
