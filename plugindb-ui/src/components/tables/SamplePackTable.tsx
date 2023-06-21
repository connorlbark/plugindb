import React, { useEffect } from 'react';

import {
  SamplePack, Tag
} from '../../types';
import { SamplePackAPI } from '../../utils/service';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { TagChip } from '../TagChip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
//import { createSamplePageName } from '../../pages/CreateSample';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export const SamplePackTable = (props: {redirect: (page: string, props?: {}) => void}) => {
  const [data, setData] = React.useState<SamplePack[]>([]);

  const init = () => {
    SamplePackAPI.getAll().then((sample_packs) => {
      setData(sample_packs);
    }).catch((e) => {
      alert("Could not access API: " + e);
    });
  }

  const playAudioFromFile = (filePath: string) => {
    const audio = new Audio("file://" + filePath);
    audio.play();
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Sample Pack', width: 150 },
    { field: 'description', headerName: 'Description', width: 400 },
    {
      field: 'url',
      headerName: 'URL',
      width: 200,
      renderCell: (params) => {
        
        return (
          <button className='button-link' onClick={() => {
            // TODO: open link
          }}>
            {params.value}
          </button>
        );
      }
    },
    { field: 'license', headerName: 'License', width: 150 },
    {
      field: "Actions",
      renderCell: (params) => {
        return (
          <div>
            <button className="button-link">
              <ModeEditIcon />
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
        getRowId={(row) => row.sample_pack_id}
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

export default SamplePackTable;
