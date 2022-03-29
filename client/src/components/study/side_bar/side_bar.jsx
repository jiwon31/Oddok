import React, { useRef } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../../recoil/user_state";
import { roomInfoState } from "../../../recoil/studyroom_state";
import Textarea from "../../commons/textarea/textarea";
import { updateStudyRoom } from "../../../api/studyroomAPI";

import styles from "./side_bar.module.css";

function SideBar({ session, roomInfo }) {
  const { updateAllowed } = useRecoilValue(userState);
  const setRoomInfo = useSetRecoilState(roomInfoState);
  const textRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    // api 요청
    // 🤔 roomInfo 저장할때 뭘 저장하는게 좋지? 유저가 입력한거 or response data
    // const res = await updateStudyRoom(roomInfo.id, { ...roomInfo, rule: textRef.current.value });
    // setRoomInfo(res.data);

    // 테스트용
    setRoomInfo({ ...roomInfo, rule: textRef.current.value });

    // 수정된 정보 브로드캐스트하기
    session
      .signal({
        data: JSON.stringify({ ...roomInfo, rule: textRef.current.value }), // JSON stringify 해야됨!
        to: [],
        type: "updated-roominfo",
      })
      .then(() => console.log("데이터 잘 갔엉🙂👋"))
      .catch((error) => console.error(error));
  };

  return (
    <aside className={styles.side_box}>
      <h1>일반 3호실</h1>
      <div className={styles.text_field}>
        <p>스터디 규칙</p>
        <div>
          <Textarea ref={textRef} disabled={!updateAllowed} content={roomInfo.rule} />
        </div>
      </div>
      {updateAllowed && (
        <button className={styles.button} type="submit" onClick={submitHandler}>
          저장
        </button>
      )}
    </aside>
  );
}

export default SideBar;
