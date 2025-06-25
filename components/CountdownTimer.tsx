"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function getNextMonthDate() {
      const now = new Date();
      // Get the first day of next month
      return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    function updateCountdown() {
      const currentDate = new Date();
      const nextMonth = getNextMonthDate();

      const totalSeconds = Math.floor(
        (nextMonth.getTime() - currentDate.getTime()) / 1000
      );

      if (totalSeconds <= 0) {
        // It's a new month, refresh the page to get new data
        window.location.reload();
        return;
      }

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(totalSeconds % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    // Update immediately
    updateCountdown();

    // Then update every second
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#1e1f2e] border-2 border-[#7eb8da] rounded-md p-4 shadow-lg relative">
      <h3 className="text-xl font-bold text-[#7eb8da] mb-3 uppercase tracking-wider pixel-font">
        Time Left
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
        <div className="bg-[#262840] border-2 border-[#7eb8da] p-2 rounded-md">
          <div className="text-2xl font-bold text-[#ffce63] pixel-font">
            {timeLeft.days}
          </div>
          <div className="text-sm text-[#7eb8da] uppercase tracking-wider pixel-font">
            Days
          </div>
        </div>
        <div className="bg-[#262840] border-2 border-[#7eb8da] p-2 rounded-md">
          <div className="text-2xl font-bold text-[#ffce63] pixel-font">
            {timeLeft.hours}
          </div>
          <div className="text-sm text-[#7eb8da] uppercase tracking-wider pixel-font">
            Hrs
          </div>
        </div>
        <div className="bg-[#262840] border-2 border-[#7eb8da] p-2 rounded-md">
          <div className="text-2xl font-bold text-[#ffce63] pixel-font">
            {timeLeft.minutes}
          </div>
          <div className="text-sm text-[#7eb8da] uppercase tracking-wider pixel-font">
            Mins
          </div>
        </div>
        <div className="bg-[#262840] border-2 border-[#7eb8da] p-2 rounded-md hidden sm:block">
          <div className="text-2xl font-bold text-[#ffce63] pixel-font">
            {timeLeft.seconds}
          </div>
          <div className="text-sm text-[#7eb8da] uppercase tracking-wider pixel-font">
            Secs
          </div>
        </div>
      </div>
    </div>
  );
}
