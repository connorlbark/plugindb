import React, { useEffect } from 'react';

import {
  Preset, Tag
} from '../../types';
import { PresetAPI } from '../../utils/service';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { TagChip } from '../TagChip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
//import { createPresetPageName } from '../../pages/CreatePreset';
import DeleteIcon from '@mui/icons-material/Delete';


export const PresetTable = (props: {redirect: (page: string, props?: {}) => void}) => {
  const [data, setData] = React.useState<Preset[]>([]);

  const init = () => {
    PresetAPI.getAll().then((presets) => {
      setData(presets);
    }).catch((e) => {
      alert("Could not access API: " + e);
    });
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 140 },
    { field: 'plugin_name', headerName: 'Plugin', width: 140 },
    {
      field: 'filepath', 
      headerName: 'File', 
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.value?.split('/').slice(-1)}
          </div>
        )
      }
    },
    { 
      field: 'tags',
      headerName: 'Tags',
      width: 200,
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
            <button className="button-link">
              <ModeEditIcon />
            </button>
            <button className="button-link" onClick={async () => {await PresetAPI.delete(params.row.preset_id); init()}}>
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
    <div style={{ height: 483, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.preset_id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}       
        slots={{ toolbar: GridToolbar }}    
      />
    </div>
  );

};

export default PresetTable;
