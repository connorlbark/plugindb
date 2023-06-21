import React, { useEffect } from 'react';

import {
  Sample, Tag
} from '../../types';
import { SampleAPI } from '../../utils/service';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { TagChip } from '../TagChip';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
//import { createSamplePageName } from '../../pages/CreateSample';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export const SampleTable = (props: {redirect: (page: string, props?: {}) => void}) => {
  const [data, setData] = React.useState<Sample[]>([]);

  const init = () => {
    SampleAPI.getAll().then((Samples) => {
      setData(Samples);
    }).catch((e) => {
      alert("Could not access API: " + e);
    });
  }

  const playAudioFromFile = (filePath: string) => {
    const audio = new Audio("file://" + filePath);
    audio.play();
  }

  const columns: GridColDef[] = [
    {
      field: 'filepath', 
      headerName: 'File', 
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            {params.value.split('/').slice(-1)}
          </div>
        )
      }
    },
    {
      field: 'audio', 
      headerName: '', 
      width: 70,
      renderCell: (params) => {
        return (
          <button className="button-link" onClick={() => playAudioFromFile(params.row.filepath)}>
            <PlayCircleIcon/>
          </button>
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
    { field: 'sample_pack_name', headerName: 'Sample Pack', width: 150 },
    { field: 'sample_pack_description', headerName: 'Sample Pack Description', width: 400 },
    {
      field: 'sample_pack_url',
      headerName: 'Sample Pack URL',
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
    { field: 'sample_pack_license', headerName: 'Sample Pack License', width: 150 },
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
        getRowId={(row) => row.sample_id}
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

export default SampleTable;
