import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FamilyMemberService from '../../services/FamilyMemberService';

const FamilyMemberManagement = () => {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        idNumber: '',
        phone: '',
        relationship: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    const fetchFamilyMembers = async () => {
        try {
            const data = await FamilyMemberService.getFamilyMembersByResident(user.id);
            setFamilyMembers(data);
        } catch (error) {
            console.error('Error fetching family members:', error);
            showSnackbar('Error fetching family members', 'error');
        }
    };

    const handleOpenDialog = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                fullName: member.fullName,
                idNumber: member.idNumber,
                phone: member.phone,
                relationship: member.relationship
            });
        } else {
            setEditingMember(null);
            setFormData({
                fullName: '',
                idNumber: '',
                phone: '',
                relationship: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingMember(null);
        setFormData({
            fullName: '',
            idNumber: '',
            phone: '',
            relationship: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMember) {
                await FamilyMemberService.updateFamilyMember(editingMember.id, formData);
                showSnackbar('Family member updated successfully', 'success');
            } else {
                await FamilyMemberService.addFamilyMember({ ...formData, residentId: user.id });
                showSnackbar('Family member added successfully', 'success');
            }
            handleCloseDialog();
            fetchFamilyMembers();
        } catch (error) {
            console.error('Error saving family member:', error);
            showSnackbar('Error saving family member', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this family member?')) {
            try {
                await FamilyMemberService.deleteFamilyMember(id);
                showSnackbar('Family member deleted successfully', 'success');
                fetchFamilyMembers();
            } catch (error) {
                console.error('Error deleting family member:', error);
                showSnackbar('Error deleting family member', 'error');
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await FamilyMemberService.updateFamilyMember(id, { status: 'APPROVED' });
            showSnackbar('Family member approved successfully', 'success');
            fetchFamilyMembers();
        } catch (error) {
            console.error('Error approving family member:', error);
            showSnackbar('Error approving family member', 'error');
        }
    };

    const handleReject = async (id) => {
        try {
            await FamilyMemberService.updateFamilyMember(id, { status: 'REJECTED' });
            showSnackbar('Family member rejected successfully', 'success');
            fetchFamilyMembers();
        } catch (error) {
            console.error('Error rejecting family member:', error);
            showSnackbar('Error rejecting family member', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'APPROVED':
                return 'success';
            case 'REJECTED':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Family Members Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Family Member
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>ID Number</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Relationship</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Parking Card</TableCell>
                            <TableCell>Gate Access</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {familyMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.fullName}</TableCell>
                                <TableCell>{member.idNumber}</TableCell>
                                <TableCell>{member.phone}</TableCell>
                                <TableCell>{member.relationship}</TableCell>
                                <TableCell>
                                    <Alert severity={getStatusColor(member.status)} sx={{ py: 0 }}>
                                        {member.status}
                                    </Alert>
                                </TableCell>
                                <TableCell>{member.hasParkingCard ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{member.hasGateAccess ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    {member.status === 'PENDING' && (
                                        <>
                                            <Button
                                                color="success"
                                                size="small"
                                                onClick={() => handleApprove(member.id)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() => handleReject(member.id)}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(member)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(member.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingMember ? 'Edit Family Member' : 'Add Family Member'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="ID Number"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Relationship"
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingMember ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FamilyMemberManagement; 