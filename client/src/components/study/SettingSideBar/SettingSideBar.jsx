import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { roomIdState } from "@recoil/studyroom_state";
import { userState } from "@recoil/user_state";
import { getStudyRoom } from "@api/study-room-api";
import useAsync from "@hooks/useAsync";
import { Hashtag, Play, Pause } from "@icons";
import styles from "./SettingSideBar.module.css";

function SettingSideBar({ clickDetailBtn }) {
  const roomId = useRecoilValue(roomIdState);
  const {
    data: roomInfo,
    loading,
    error,
  } = useAsync(() => getStudyRoom(roomId), { onError: (e) => console.log(e) }, [roomId], false);
  const { updateAllowed } = useRecoilValue(userState);
  const [isPlay, setIsPlay] = useState(false);

  const toggleBgm = () => {
    setIsPlay((prev) => !prev);
  };

  return (
    <aside className={styles.side_box}>
      {loading ? (
        <div>로딩중....</div>
      ) : (
        <>
          <h1>{roomInfo?.name}</h1>
          <div className={styles.roomInfo_item}>
            <div className={styles.hashtag}>
              {roomInfo?.hashtags.map((hashtag) => (
                <div>
                  <div className={styles.icon}>
                    <Hashtag />
                  </div>
                  <div>{hashtag}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.info_item}>
            <p>목표시간</p>
            <div className={styles.text_field}>{roomInfo?.targetTime}시간</div>
          </div>
          <div className={`${styles.info_item} ${styles.rule}`}>
            <p>스터디 규칙</p>
            <div className={`${styles.text_field} ${styles.text_area}`}>{roomInfo?.rule ? roomInfo.rule : "없음"}</div>
          </div>
          <div className={styles.info_item}>
            <p>음악</p>
            <div className={styles.bgm_field}>
              <span className={styles.bgm_icon} onClick={toggleBgm}>
                {isPlay ? <Pause /> : <Play />}
              </span>
              <span>소녀시대 - 힘내!</span>
            </div>
          </div>
          {updateAllowed && (
            <button className={styles.button} type="submit" onClick={clickDetailBtn}>
              방 정보 수정
            </button>
          )}
        </>
      )}
    </aside>
  );
}

export default SettingSideBar;
