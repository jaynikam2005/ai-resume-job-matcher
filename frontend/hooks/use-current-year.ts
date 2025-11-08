import { useEffect, useState } from 'react';

export function useCurrentYear() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Update year at midnight on January 1st
    const updateYear = () => {
      setYear(new Date().getFullYear());
    };

    // Check and update year every day at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      updateYear();
      // Then check every 24 hours
      interval = setInterval(updateYear, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return year;
}