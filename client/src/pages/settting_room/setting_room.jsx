import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import { createSession, createToken } from "../testserver"; // testServer
// import createSession from "../../api/createSession";
// import createToken from "../../api/createToken";

import SettingBar from "../../components/study/setting_bar/setting_bar";
import SettingSection from "../../components/study/setting_section/setting_section";
import styles from "./setting_room.module.css";
import StudyRoom from "../study_room/study_room";
import TimeRecord from "../../components/study/time_record/time_record";

const testdata = {
  name: "일반 1호실",
  category: "일반",
  hashtags: ["교시제", "아침기상", "인증"],
  target_time: 10,
  limit_users: 4,
  is_public: false,
  password: "1234",
  rule: "규칙",
  start_at: new Date(2022, 3, 22),
  end_at: new Date(2022, 3, 31),
};

function SettingRoom() {
  const videoRef = useRef();
  const history = useHistory();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [clickedSettingBtn, setClickedSettingBtn] = useState(false);
  const displayType = clickedSettingBtn === true ? styles.hide : styles.show;

  // 서버로 보내줄 object
  const [roomInfo, setRoomInfo] = useState({});

  const [session, setSession] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);

  const [userId, setUserId] = useState(`${Math.floor(Math.random() * 10000000)}`);
  const [isHost, setIsHost] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isEnter, setIsEnter] = useState(false);

  // 서버용🤔
  // const requestCreateRoom = async () => {
  //   if (isHost) {
  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       localStorage.setItem("userId", "user_juhee");
  //       const resId = await createSession(testdata);
  //       const resToken = await createToken(resId.data.id);
  //       await session.connect(resToken.data.token, { clientData: userId });
  //       setIsEnter((prev) => !prev);
  //     } catch (err) {
  //       console.log(err.code, err.message);
  //       setError(err.message);
  //     }
  //     setIsLoading(false);
  //   }
  // };

  // TEST용
  const requestCreateRoom = async () => {
    if (isHost) {
      setIsLoading(true);
      setError(null);
      try {
        const roomId = await createSession("1");
        const token = await createToken(roomId);
        await session.connect(token, { clientData: userId });
        setIsEnter((prev) => !prev);
      } catch (err) {
        console.log(err.code, err.message);
        setError(err.message);
      }
    }
  };

  const goToStudyRoom = () => {
    requestCreateRoom();
    if (!error) {
      // ERROR: session publisher 객체 못보냄
      // history.push({
      //   pathname: "/study-room/:id",
      //   state: {
      //     session,
      //     publisher,
      //   },
      // });
    }
  };

  const stopOrStartVideo = () => {
    setIsPlaying((prev) => !prev);
  };

  const stopOrStartAudio = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    const OV = new OpenVidu();
    const getVideoandAudio = async () => {
      setSession(OV.initSession());
      const devices = await OV.getDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setPublisher(
        OV.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: videoDevices.label ? videoDevices.deviceId : undefined,
          publishAudio: true,
          publishVideo: true,
          frameRate: 30,
          mirror: false,
        }),
      );
    };
    getVideoandAudio();
  }, []);

  useEffect(() => {
    if (publisher) {
      publisher.addVideoElement(videoRef.current);
    }
  }, [publisher, videoRef]);

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(isPlaying);
      publisher.publishAudio(isMuted);
    }
  }, [isPlaying, isMuted, publisher]);

  const clickSettingBtn = () => {
    setClickedSettingBtn((prev) => !prev);
  };

  const saveHandler = (obj) => {
    setRoomInfo(obj);
  };

  return (
    <>
      {!isEnter && (
        <div className={styles.room}>
          {clickedSettingBtn && (
            <SettingSection //
              clickSettingBtn={clickSettingBtn}
            />
          )}
          <section className={`${styles.video_component} ${displayType}`}>
            <video className={styles.video} ref={videoRef} autoPlay />
            <TimeRecord />
          </section>
          <div className={`${styles.bar} ${displayType}`}>
            <SettingBar //
              goToStudyRoom={goToStudyRoom}
              stopOrStartVideo={stopOrStartVideo}
              stopOrStartAudio={stopOrStartAudio}
              clickSettingBtn={clickSettingBtn}
            />
          </div>
        </div>
      )}
      {isEnter && !error && <StudyRoom session={session} publisher={publisher} />}
    </>
  );
}

export default SettingRoom;
