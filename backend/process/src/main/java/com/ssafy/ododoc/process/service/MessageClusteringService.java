package com.ssafy.ododoc.process.service;

public class MessageClusteringService {
//    private LinkedList<MessageDto> messageQueue = new LinkedList<>();
//    private Duration threshold = Duration.ofMinutes(1); // 통합할 시간 간격 설정
//
//    public void integrateMessage(MessageDto newMessage) {
//        if (!messageQueue.isEmpty() && isWithinThreshold(messageQueue.getLast().getTimestamp(), newMessage.getTimestamp())) {
//            // 통합 로직: 마지막 메시지와 시간 간격이 threshold 이내일 경우
//            // 예를 들어, 내용을 합치는 등의 처리를 할 수 있습니다.
//            // 여기서는 단순히 리스트에 추가하는 것으로 예시합니다.
//            messageQueue.getLast().setContent(mergeContent(messageQueue.getLast().getContent(), newMessage.getContent()));
//        } else {
//            // 새 메시지를 큐에 추가
//            messageQueue.add(newMessage);
//        }
//    }
//
//    private boolean isWithinThreshold(LocalDateTime time1, LocalDateTime time2) {
//        return Duration.between(time1, time2).abs().compareTo(threshold) <= 0;
//    }
//
//    private Object mergeContent(Object content1, Object content2) {
//        // 실제 내용을 어떻게 통합할지는 애플리케이션의 요구사항에 따라 다릅니다.
//        // 이 예에서는 단순히 두 내용을 리스트로 합치는 것으로 구현합니다.
//        List<Object> merged = new ArrayList<>();
//        merged.add(content1);
//        merged.add(content2);
//        return merged;
//    }
}
