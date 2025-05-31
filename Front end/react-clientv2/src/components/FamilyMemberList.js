import React, { useState, useEffect, useContext } from 'react';
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
import { MyUserContext } from '../configs/Contexts';
import { authApis, endpoints } from '../configs/Apis';

const FamilyMemberList = () => {
    const user = useContext(MyUserContext);
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

    useEffect(() => {
        if (user?.id) {
            fetchFamilyMembers();
        }
    }, [user]);

    const fetchFamilyMembers = async () => {
        try {
            const response = await authApis().get(`${endpoints['family-members-by-resident']}/${user.id}`);
            setFamilyMembers(response.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách thành viên:', error);
            showSnackbar('Lỗi khi tải danh sách thành viên', 'error');
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
            const url = editingMember
                ? `${endpoints['family-members']}/${editingMember.id}`
                : endpoints['family-members'];
            
            const method = editingMember ? 'put' : 'post';
            const body = editingMember
                ? formData
                : { ...formData, residentId: user.id };

            const response = await authApis()[method](url, body);

            if (response.status === 200 || response.status === 201) {
                showSnackbar(
                    editingMember
                        ? 'Cập nhật thành viên thành công'
                        : 'Thêm thành viên thành công',
                    'success'
                );
                handleCloseDialog();
                fetchFamilyMembers();
            }
        } catch (error) {
            console.error('Lỗi khi lưu thông tin thành viên:', error);
            showSnackbar('Lỗi khi lưu thông tin thành viên', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
            try {
                const response = await authApis().delete(`${endpoints['family-members']}/${id}`);

                if (response.status === 204) {
                    showSnackbar('Xóa thành viên thành công', 'success');
                    fetchFamilyMembers();
                }
            } catch (error) {
                console.error('Lỗi khi xóa thành viên:', error);
                showSnackbar('Lỗi khi xóa thành viên', 'error');
            }
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

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Đang chờ duyệt';
            case 'APPROVED':
                return 'Đã duyệt';
            case 'REJECTED':
                return 'Từ chối';
            default:
                return status;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Thẻ thành viên
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Thêm thành viên
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Số CMND/CCCD</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Mối quan hệ</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thao tác</TableCell>
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
                                        {getStatusText(member.status)}
                                    </Alert>
                                </TableCell>
                                <TableCell>
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

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Họ và tên"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Số CMND/CCCD"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Số điện thoại"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Mối quan hệ</InputLabel>
                            <Select
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="SPOUSE">Vợ/Chồng</MenuItem>
                                <MenuItem value="CHILD">Con</MenuItem>
                                <MenuItem value="PARENT">Bố/Mẹ</MenuItem>
                                <MenuItem value="SIBLING">Anh/Chị/Em</MenuItem>
                                <MenuItem value="OTHER">Khác</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingMember ? 'Cập nhật' : 'Thêm mới'}
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

export default FamilyMemberList; 