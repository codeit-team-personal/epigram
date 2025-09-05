'use client';
import { create } from 'zustand';

type State = {
  editingId: number | null; // 현재 편집 중인 댓글 id(전역 단일)
  pendingId: number | null; // 다른 댓글 수정 버튼을 눌렀을 때 대기 id
  showDialog: boolean; // 전환 경고 다이얼로그 오픈 여부
  tryStart: (id: number) => void; // 편집 시작 요청(가드 포함)
  confirm: () => void; // 전환 경고 확인
  cancel: () => void; // 전환 경고 취소
  stop: () => void; // 편집 모드 종료
};

export const useCommentEditStore = create<State>((set, get) => ({
  editingId: null,
  pendingId: null,
  showDialog: false,

  tryStart: (id) => {
    const { editingId } = get();
    if (editingId && editingId !== id) {
      // 이미 다른 댓글 편집 중 → 전환 경고
      set({ pendingId: id, showDialog: true });
    } else {
      // 그냥 바로 편집 시작
      set({ editingId: id, pendingId: null, showDialog: false });
    }
  },

  confirm: () => {
    const { pendingId } = get();
    if (pendingId) {
      // 이전 편집은 자동 취소(드래프트 폐기), 새 편집으로 전환
      set({ editingId: pendingId, pendingId: null, showDialog: false });
    } else {
      set({ showDialog: false });
    }
  },

  cancel: () => set({ pendingId: null, showDialog: false }),

  stop: () => set({ editingId: null }),
}));
