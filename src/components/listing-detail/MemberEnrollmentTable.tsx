import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "ag-grid-community";

interface MemberEnrollmentTableProps {
  listingId?: string | null;
}

const MemberEnrollmentTable: React.FC<MemberEnrollmentTableProps> = ({
  listingId,
}) => {
  const [rowData, setRowData] = useState([]);
  const safeListingId = listingId ?? "";

  // Type the columnDefs as ColDef[]
  const [columnDefs] = useState<ColDef[]>([
    {
      headerName: "Member ID",
      field: "memberId",
      headerClass: "font-bold border p-2 font-bold  text-md",
      flex: 2,
    },
    {
      headerName: "Name",
      field: "name",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Age",
      field: "age",
      headerClass: "font-bold border p-2 font-bold  text-md",
      flex: 1,
    },
    {
      headerName: "Gender",
      field: "gender",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
    {
      headerName: "Address",
      field: "address",
      headerClass: "font-bold border p-2 font-bold  text-md",
    },
  ]);

  useEffect(() => {
    if (safeListingId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/enrollment-details/${safeListingId}`
        )
        .then((response) => setRowData(response.data.members))
        .catch((error) =>
          console.log("Error fetching enrollment details:", error)
        );
    }
  }, [safeListingId]);

  return (
    <>
      <div className="ag-theme-quartz " style={{ height: 400, width: "100%" }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
    </>
  );
};

export default MemberEnrollmentTable;
