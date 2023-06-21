import React, { useEffect } from 'react';

import {
  SamplePack, Tag
} from '../../types';
import { SamplePackAPI } from '../../utils/service';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
//import { createSamplePageName } from '../../pages/CreateSample';
import DeleteIcon from '@mui/icons-material/Delete';
import { samplePackFormPageName } from '../../pages/SamplePackForm';

export const SamplePackTable = (props: {redirect: (page: string, props?: {}) => void}) => {
  const [data, setData] = React.useState<SamplePack[]>([]);

  const init = () => {
    SamplePackAPI.getAll().then((sample_packs) => {
      setData(sample_packs);
    }).catch((e) => {
      alert("Could not access API: " + e);
    });
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
            <button className="button-link" onClick={async () => {props.redirect(samplePackFormPageName, { initialSamplePack: params.row })}}>
              <ModeEditIcon />
            </button>
            <button className="button-link" onClick={async () => {await SamplePackAPI.delete(params.row.sample_pack_id); init()}}>
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
        getRowId={(row) => row.sample_pack_id}
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

export default SamplePackTable;
