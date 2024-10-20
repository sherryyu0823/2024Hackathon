import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GachaMachine({ onGacha }) {
  const [reward, setReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    checkCanPlay();
  }, []);

  const checkCanPlay = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/can-play-gacha', {
        headers: { 'user-id': 'user123' } // 在实际应用中，使用真实的用户ID
      });
      setCanPlay(response.data.canPlay);
    } catch (error) {
      console.error('Error checking if user can play:', error);
    }
  };
  const handleGachaClick = async () => {  // 这里添加 async 关键字
    const confirmed = window.confirm('消耗 80 點進行抽獎，是否繼續？');
    if (!confirmed) return;


    setIsAnimating(true); // Start the animation

    try {
      const response = await axios.post('http://localhost:5000/api/gacha', {}, {
        headers: { 'user-id': 'user123' } // 在实际应用中，使用真实的用户ID
      });
      if (response.data.success) {
        // Delay the display of the reward by 2 seconds (after animation ends)
        setTimeout(() => {
          setReward(response.data.reward); // Set the reward result
          setShowModal(true); // Show the result in a modal
          setIsAnimating(false); // Stop the handle rotation
        }, 1000); // 1-second delay for the animation
        setReward(response.data.reward);
        setCanPlay(false);
        onGacha(response.data.reward); // 通知父组件更新点数
      } else {
        alert(response.data.message || '抽獎失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Error playing gacha:', error.stack);
      alert('抽獎失敗，請稍後再試');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="gacha-container" style={{cursor: 'pointer'}}>
        <img
          src="m2.png"
          alt="扭蛋機"
          //className="gacha-image"
          // style={{ width: '1000px'}}
          onClick={handleGachaClick}
        />
        <div className={`gacha-handle ${isAnimating ? 'animating' : ''}`} onClick={handleGachaClick}>
          <img
            src="扭蛋機把手.png"
            alt="扭蛋機把手"
            className="handle-image"
            style={{ width: '100px', height:'100px'}}
          />
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>恭喜你抽中了！</h3>
            <p>{reward}</p>
            <button onClick={handleCloseModal}>關閉</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GachaMachine;