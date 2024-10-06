"use client"

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import axios from 'axios';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"

export default function Active() {
  const navigate = useNavigate();
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
  const [confirmationText, setConfirmationText] = useState('');
  const [status, setStatus] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Add this line

  useEffect(() => {
    const fetchChallans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/locations');
        setChallans(response.data);
      } catch (err) {
        console.error('Error fetching challans:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChallans();
  }, []);

  const handleMapClick = (id) => {
    navigate(`/map?id=${id}&zoom=25`);
  };

  const handleEditClick = (challan) => {
    setSelectedChallan(challan);
    setIsPopupOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedChallan || confirmationText !== 'Confirm' || !status) {
      alert("Please enter 'Confirm' and select a status");
      return;
    }

    const updatedData = {
      last_reviewed_by: 'Joe',
      last_modified: new Date().toISOString(),
      status: status, // Update status here
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/locations/${selectedChallan._id}`,
        updatedData
      );

      setChallans((prevChallans) =>
        prevChallans.map((challan) =>
          challan._id === selectedChallan._id ? response.data : challan
        )
      );

      setIsPopupOpen(false);
    } catch (err) {
      console.error('Error updating challan:', err.response ? err.response.data : err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setSelectedChallan((prev) => ({ ...prev, [field]: value }));
  };

  const requestSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setSortConfig({ key, direction });
  };

  const sortedChallans = React.useMemo(() => {
    let sortableChallans = [...challans];
    if (sortConfig.key) {
      sortableChallans.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableChallans;
  }, [challans, sortConfig]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-semibold text-red-500">Error loading data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-hidden">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-grow p-8 flex flex-col">
      <div className="bg-white rounded-lg flex-1 flex flex-col p-4 sm:p-6 md:p-8 pt-16 sm:pt-20 md:pt-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center md:text-left">Active Challans</h1>
        <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto h-[600px] sm:h-[600px] md:h-[600px] lg:h-[600px] scrollbar-thin scrollbar-thumb-red-800 scrollbar-track-gray-300 scrollbar-thumb-rounded-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">S.No.</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('layout')}>
                    Location <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'layout' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('created_at')}>
                    Time <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'created_at' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('registration_plate')}>
                    Vehicle ID <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'registration_plate' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('phone')}>
                    Complainee <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'phone' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('assigned_to')}>
                    Assigned To <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'assigned_to' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('challan_amount')}>
                    Amount <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'challan_amount' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('token_id')}>
                    Token No. <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'token_id' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('last_reviewed_by')}>
                    Last Reviewed <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'last_reviewed_by' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('last_modified')}>
                    At <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'last_modified' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
                    Status <ChevronDown className={`inline ml-1 h-4 w-4 ${sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedChallans.map((challan, index) => (
                  <TableRow key={challan._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{challan.layout}</TableCell>
                    <TableCell>{new Date(challan.created_at).toLocaleString()}</TableCell>
                    <TableCell>{challan.registration_plate}</TableCell>
                    <TableCell>
                      {challan.phone?.startsWith('whatsapp:')
                        ? challan.phone.slice(9)
                        : challan.phone}
                    </TableCell>
                    <TableCell>{challan.assigned_to || 'Unassigned'}</TableCell>
                    <TableCell>{challan.challan_amount}</TableCell>
                    <TableCell>{challan.token_id}</TableCell>
                    <TableCell>{challan.last_reviewed_by || 'N/A'}</TableCell>
                    <TableCell>{new Date(challan.last_modified).toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          challan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {challan.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMapClick(challan._id)}
                        className="mr-2"
                      >
                        Map
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(challan)}
                      >
                        <FaPen className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      </div>
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Challan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="confirmation" className="text-right">
                Confirm
              </label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="col-span-3"
                placeholder="Enter 'Confirm' to confirm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Status</label>
              <div className="col-span-3 flex space-x-2">
                <Button variant={status === 'Completed' ? "solid" : "outline"} onClick={() => setStatus('Completed')}>
                  Completed
                </Button>
                <Button variant={status === 'Closed' ? "solid" : "outline"} onClick={() => setStatus('Closed')}>
                  Closed
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsPopupOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}