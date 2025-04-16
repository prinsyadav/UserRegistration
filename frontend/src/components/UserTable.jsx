import React, { useState, useEffect } from "react";
import { fetchUsers } from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  TablePagination,
  IconButton,
  Tooltip,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      const errorMsg =
        err.response?.data || err.message || "Failed to fetch users.";
      console.error("Fetch Users Error:", err.response || err);
      setError(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = users.filter((user) => {
        return (
          user.name.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch) ||
          user.mobile.includes(lowercasedSearch) ||
          user.city.toLowerCase().includes(lowercasedSearch)
        );
      });
      setFilteredUsers(filtered);
    }
    setPage(0);
  }, [searchTerm, users]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    loadUsers();
    setSearchTerm("");
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
  };

  // Create sortable header cell
  const SortableTableCell = ({ id, label }) => (
    <TableCell
      sortDirection={orderBy === id ? order : false}
      sx={{ color: "common.white", fontWeight: "bold", whiteSpace: "nowrap" }}
    >
      <TableSortLabel
        active={orderBy === id}
        direction={orderBy === id ? order : "asc"}
        onClick={() => handleRequestSort(id)}
        sx={{
          color: "white",
          "&.MuiTableSortLabel-active": {
            color: "white",
          },
          "& .MuiTableSortLabel-icon": {
            color: "white !important",
          },
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: "50%", md: "40%" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title="Refresh Data">
          <IconButton
            onClick={handleRefresh}
            color="primary"
            disabled={isLoading}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          <TableContainer
            component={Paper}
            sx={{ overflowX: "auto", borderRadius: 2, boxShadow: 2 }}
          >
            <Table aria-label="user table">
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableRow>
                  <SortableTableCell id="id" label="ID" />
                  <SortableTableCell id="name" label="Name" />
                  <SortableTableCell id="email" label="Email" />
                  <SortableTableCell id="mobile" label="Mobile" />
                  <SortableTableCell id="city" label="City" />
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  sortData([...filteredUsers])
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={user.mobile}
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>{user.city}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <Typography color="textSecondary">
                        {searchTerm
                          ? "No users match your search criteria."
                          : "No users registered yet."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </>
      )}
    </div>
  );
}

export default UserTable;
