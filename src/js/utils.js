export const getTimeLeft = (dueDateTime) => {
  const now = Date.now();
  const dueDate = new Date(dueDateTime).getTime();
  let diff = dueDate - now;

  const isLate = diff < 0;
  diff = Math.abs(diff);

  const timeUnits = [
    { label: "d", value: 1000 * 60 * 60 * 24 },
    { label: "h", value: 1000 * 60 * 60 },
    { label: "m", value: 1000 * 60 },
  ];

  const timeParts = timeUnits.reduce((acc, unit) => {
    const amount = Math.floor(diff / unit.value);
    diff -= amount * unit.value;
    if (amount > 0) acc.push(`${amount}${unit.label}`);
    return acc;
  }, []);

  return isLate
    ? `Time's up, ${timeParts.join(" ")} late`
    : `${timeParts.join(" ")} left`;
};
