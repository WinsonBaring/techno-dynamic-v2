import React, { useEffect, useState } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';

import { LessonsService } from 'apis/LessonsService';
import LessonPage from 'components/lessonpage/LessonPage';
import FooterControls from 'components/lessonpage/FooterControls';
import FilesModal from 'components/lessonpage/FilesModal';
import ChatbotDialog from 'components/lessonpage/ChatbotDialog';
import { Typography, Box, Button } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import HistoryIcon from '@mui/icons-material/History';
import Fab from '@mui/material/Fab';
import VerifiedIcon from '@mui/icons-material/Verified';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationLayout from '../Notification/NotificationLayout';
import InsightLayout from '../Insight/InsightLayout';
import { SuggestionService } from 'apis/SuggestionService';
import { NotificationService } from '../../apis/NotificationService';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const RevertContent = () => {
  const { lessonNumber, pageNumber, lessonID } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isReverted, setReverted] = useState(false);
  const theme = useTheme();
  const currID = parseInt(lessonID);

  useEffect(() => {
    getLessonLessonNumber(lessonNumber);
  }, []);

  const suggestClick = () => {
    console.log('suggest clicked');
    navigate(`/suggest/${lessonNumber}/1/`);
  };

  const handleClearCallbackSuggestionAndNotification = async () => {
    await handleClearNotif();
    await handleClearSuggestionAndFaq();
    navigate(`/`);
  };

  const handleClearNotif = async () => {
    try {
      const response = await NotificationService.deleteNotifByLessonId(currID);
      // setLesson(response.data);
      console.log('response.data', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
    }
  };

  const handleClearSuggestionAndFaq = async () => {
    try {
      const response = await SuggestionService.delete_suggestion(currID);
      // setLesson(response.data);
      console.log('response.data', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
    }
  };

  const handleRevert = async () => {
    // console.log("revert clicked");
    setReverted(true);
    await revertContentService();
    await getLessonLessonNumber(lessonNumber);
  };

  const revertContentService = async () => {
    try {
      const response = await SuggestionService.revert_content(currID);
      // setLesson(response.data);
      console.log('response.data', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
    }
  };

  const getLessonLessonNumber = async (lessonNumber) => {
    try {
      const response = await LessonsService.getByLessonNumber(lessonNumber);
      setLesson(response.data);
      console.log('response.data', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < lesson?.pages?.length) {
      setCurrentPage((prev) => prev + 1);
      navigate(`/lessons/${lessonNumber}/${currentPage + 1}`);
    } else {
      navigate(`/lessons/${lessonNumber}/end`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      navigate(`/lessons/${lessonNumber}/${currentPage - 1}`);
    } else {
      navigate(`/`);
    }
  };

  const handleEditPage = () => {
    navigate(`/lessons/${lessonNumber}/edit`);
  };

  const handleOpenFiles = () => {
    setFileModalOpen(true);
  };

  const handleCloseFiles = () => {
    setFileModalOpen(false);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <Box>
      <Container
        component='main'
        sx={{
          mt: 2,
          mb: 12
        }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <Navigate to='/404' replace />
        ) : (
          <>
            {!isReverted && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  marginTop: '-17px',
                  padding: '20px',
                  borderRadius: '5px',
                  // bgcolor: "#4c80d4",
                  bgcolor: theme.palette.primary.main,
                  height: 'fit-content',
                  marginBottom: '3%'
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                  <ThumbUpIcon sx={{ color: '#fff', marginRight: '10px' }} />
                  <Typography
                    variant='body1'
                    sx={{
                      color: '#fff',
                      flex: 1,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}>
                    Suggested content has been added!
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      sx={{
                        backgroundColor: '#212121',
                        '&:hover': {
                          backgroundColor: '#424242'
                        },
                        textTransform: 'none', // Set text to normal case
                        paddingRight: '10px' // Add padding to the right of the icon
                      }}
                      onClick={handleRevert}>
                      <HistoryIcon sx={{ marginRight: '10px' }} />
                      Revert Changes
                    </Button>
                    <Box sx={{ display: 'flex', marginLeft: '10px' }}>
                      <Button
                        variant='contained'
                        color='primary'
                        sx={{
                          backgroundColor: '#3a66a8',
                          '&:hover': {
                            backgroundColor: '#4c80d4'
                          },
                          textTransform: 'none', // Set text to normal case
                          paddingRight: '10px' // Add padding to the right of the icon
                        }}
                        onClick={handleClearCallbackSuggestionAndNotification}>
                        <DoneAllIcon sx={{ marginRight: '10px' }} />
                        Looks good to me!
                      </Button>
                    </Box>
                  </Box>
                </div>
              </Box>
            )}

            {isReverted && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  marginTop: '-17px',
                  padding: '20px',
                  borderRadius: '5px',
                  bgcolor: '#212121',
                  //   bgcolor: theme.palette.primary.main,
                  height: 'fit-content',
                  marginBottom: '3%'
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                  <HistoryIcon sx={{ color: '#fff', marginRight: '10px' }} />
                  <Typography
                    variant='body1'
                    sx={{
                      color: '#fff',
                      flex: 1,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}>
                    We've managed to revert your previous content!
                  </Typography>
                  <Box sx={{ display: 'flex', marginLeft: '10px' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      sx={{
                        backgroundColor: '#3a66a8',
                        '&:hover': {
                          backgroundColor: '#4c80d4'
                        },
                        textTransform: 'none', // Set text to normal case
                        paddingRight: '10px' // Add padding to the right of the icon
                      }}
                      onClick={handleClearCallbackSuggestionAndNotification}>
                      <HistoryIcon sx={{ marginRight: '10px' }} />
                      Return to Dashboard
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex' }}></Box>
                </div>
              </Box>
            )}

            <LessonPage
              // pageContent={!isReverted ? (lesson?.pages[currentPage - 1]?.contents) : (tempSuggestedContent)}
              pageContent={lesson?.pages[currentPage - 1]?.contents}
              //  pageContent={tempSuggestedContent}
            />
            <FilesModal
              files={lesson?.lesson_files}
              open={fileModalOpen}
              handleClose={handleCloseFiles}
            />
            <Fab
              color='primary'
              onClick={handleOpenChat}
              sx={{
                position: 'fixed',
                bottom: '100px',
                right: '50px'
              }}>
              <ChatIcon />
            </Fab>
            <ChatbotDialog
              open={isChatOpen}
              handleClose={handleCloseChat}
              lessonId={lesson.id}
              pageId={lesson?.pages[currentPage - 1]?.id}
            />
          </>
        )}
      </Container>
      {/* <FooterControls
        isFirstPage={currentPage === 1}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleEditPage={handleEditPage}
        handleOpenFiles={handleOpenFiles}
      /> */}
    </Box>
  );
};

export default RevertContent;
