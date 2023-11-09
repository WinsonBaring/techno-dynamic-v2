import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './QueryConversation.css';

import { QueriesService } from 'apis/QueriesService';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const QueryDetailsDialog = ({ isOpen, onClose, selectedRow }) => {
  const [subqueriesArray, setSubqueriesArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubqueries = async () => {
      if (selectedRow && selectedRow.id) {
        const subqueries = await getQueryById(selectedRow.id);
        setSubqueriesArray(subqueries);
      }
    };
    fetchSubqueries();
  }, [selectedRow]);

  const handleEditLesson = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to edit this lesson?'
    );
    
    if (isConfirmed) {
      // If user confirms, navigate to the edit page
      navigate(`/lessons/${selectedRow.lessonId}/edit`);
    }
  };

  const getQueryById = async (id) => {
    try {
      const queryResponse = await QueriesService.getById(id);
      if (queryResponse) {
        const query = queryResponse.data;
        // Map the subqueries array
        const subqueriesArray = query.subqueries.map((subquery) => ({
          question: subquery.question,
          response: subquery.response
        }));

        // Return the formatted subqueries array
        return subqueriesArray;
      }
    } catch (error) {
      console.log(error);
      // Handle error as needed, e.g., set an error state or throw an exception
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth='md' fullWidth={true}>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between'>
          {selectedRow && (
            <Box display='flex' flexDirection='row'>
              <Box className='box-container'>
                <Typography variant='subtitle2'>
                  Lesson {selectedRow.lessonNumber} - {selectedRow.title}
                </Typography>
              </Box>
              <Box className='box-container'>
                <Typography variant='subtitle2'>
                  {selectedRow.firstName} {selectedRow.lastName}
                </Typography>
              </Box>
              <Box className='box-container'>
                <Typography variant='subtitle2'>
                  {selectedRow.year} - {selectedRow.course}
                </Typography>
              </Box>
            </Box>
          )}
          <Box display='flex' alignItems='center' style={{ margin: '-10px' }}>
            <DialogActions>
              <Button onClick={onClose} endIcon={<CloseIcon />}>
                Close
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {subqueriesArray.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '500px'
            }}>
            {subqueriesArray.map((subquery, index) => (
              <div key={index}>
                <div className='question-bubble'>
                  <Typography variant='subtitle1'>
                    {subquery.question}
                  </Typography>
                </div>
                <div className='response-bubble'>
                  <Typography variant='subtitle1'>
                    {subquery.response}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography variant='subtitle1'>No questions available</Typography>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={handleEditLesson}
          startIcon={<EditIcon />}
          fullWidth>
          Edit Lesson
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QueryDetailsDialog;
