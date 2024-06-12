from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status

from api.model.Faq import Faq
from api.model.GroupedQuestions import GroupedQuestions
from api.model.Notification import Notification
from api.serializer.FaqSerializer import FaqSerializer
from api.serializer.GroupedQuestionsSerializer import GroupedQuestionsSerializer
from api.serializer.NotificationSerializer import NotificationSerializer

class NotificationController(ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


    @action(detail=False, methods=['get'])
    def getUnread(self, request):
        try:
            unread_notifications = self.queryset.all()
            serializer = self.get_serializer(unread_notifications, many=True)
            notifications_data = serializer.data

            # Add grouped questions and faqs data
            # for notification in notifications_data:
            #     grouped_questions = GroupedQuestions.objects.filter(notification_id=notification['notif_id'])
            #     grouped_questions_serializer = GroupedQuestionsSerializer(grouped_questions, many=True)
            #     notification['grouped_questions'] = grouped_questions_serializer.data

                # for grouped_question in notification['grouped_questions']:
                #     faqs = Faq.objects.filter(grouped_questions_id=grouped_question['grouped_question_id'])
                #     faq_serializer = FaqSerializer(faqs, many=True)
                #     grouped_question['faqs'] = faq_serializer.data

            return Response(notifications_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'])
    def getCountUnread(self, request):
        try:
            unread_notifs_count = self.queryset.filter(is_read=False).count()
            return Response({"unread_count": unread_notifs_count}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['delete'])
    def deleteNotificationById(self, request):
        notification_id = request.data.get('notification_id')
        if not notification_id:
            return Response({"error": "notification_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification = get_object_or_404(Notification, notif_id=notification_id)
            notification.delete()
            return Response({"message": "Notification deleted successfully"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['patch'])
    def setOpenedNotificationById(self, request):
        notification_id = request.data.get('notification_id')
        if not notification_id:
            return Response({"error": "notification_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification = get_object_or_404(Notification, notif_id=notification_id)
            notification.is_open = True
            notification.save()
            return Response({"message": "Notification opened successfully"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['delete'])
    def deleteNotification(self, request):
        lesson_id = request.data.get('lesson_id')
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification = Notification.objects.filter(lesson_id=lesson_id).first()
            if not notification:
                return Response({"error": "No notification found for the given lesson_id"},
                                status=status.HTTP_404_NOT_FOUND)
            notification.delete()
            return Response({"message": "Notification deleted successfully"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_all_notification(self, request):
        try:
            all_notifications = self.queryset.all()  # Fetch all notifications
            serializer = self.get_serializer(all_notifications, many=True)
            # print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_all_count_unread_notif(self, request):
        try:
            unread_notifs_count = self.queryset.filter(is_read=False).count()
            return Response({"unread_count": unread_notifs_count}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['put'])
    def mark_all_as_read(self, request):
        print("mark read was called")
        try:
            unread_notifs = self.queryset.filter(is_read=False)
            unread_notifs.update(is_read=True)
            return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
