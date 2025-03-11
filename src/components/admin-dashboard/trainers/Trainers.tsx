import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { ColDef, ICellRendererParams, GridApi } from "ag-grid-community";

function Trainers() {
  const gridRef = useRef<AgGridReact<any>>(null);
  let gridApi: GridApi | null = null;
  // const onGridReady = (params: { api: GridApi }) => {
  //   gridApi = params.api;
  //   gridApi.sizeColumnsToFit(); // Adjust column widths to fit the grid
  // };
  const onGridReady = (params: { api: GridApi }) => {
    gridRef.current!.api = params.api;
    gridRef.current!.api.sizeColumnsToFit(); // Adjust column widths to fit the grid
  };

  const [rowData, setRowData] = useState<
    { fname: string; lname: string; email: string; phone: string }[]
  >([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      headerName: "Name",
      valueGetter: (params) => `${params.data.fname} ${params.data.lname}`,
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Email",
      field: "email",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Phone",
      field: "phone",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Qualification",
      field: "qualifications",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Action",
      field: "",
      headerClass: "font-bold border p-2 font-bold  text-md",
      cellRenderer: (data: ICellRendererParams) => (
        <div className="flex gap-8">
          <button
            onClick={() => {
              handleRemove(data.data._id, data.data.email);
            }}
            className="text-red-500 font-bold">
            Delete
          </button>
        </div>
      ),
    },
  ]);

  const handleRemove = async (trainerID: string, trainerEmail: string) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/discard-trainer/` +
        trainerID.toString()
    );
    //  console.log(response.data);
    setRowData((prevData) =>
      prevData.filter((row) => row.email != trainerEmail)
    );
  };

  // useEffect(() => {
  //   if (gridRef.current && gridApi) {
  //     gridApi.sizeColumnsToFit(); // Re-fit columns when data changes
  //   }
  // }, [rowData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/trainers`
        );

        // console.log(response);

        setRowData(response.data.trainer);
      } catch (error) {
        console.log("error");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-3 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Trainers</h3>
          <div className="overflow-y-auto h-64 w-[96%] ">
            <div
              className="ag-theme-quartz "
              style={{ height: "100%", width: "100%" }}>
              {/* <AgGridReact
                ref={gridRef}
                rowData={rowData || []}
                columnDefs={colDefs}
                onGridReady={() => {
                  onGridReady;
                }}
              /> */}
              <AgGridReact
                ref={gridRef}
                rowData={rowData || []}
                columnDefs={colDefs}
                onGridReady={onGridReady}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Trainers;
