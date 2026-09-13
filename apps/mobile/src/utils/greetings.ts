export const getGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) return "Good morning";
  if (currentHour < 17) return "Good afternoon";
  if (currentHour < 21) return "Good evening";
  return "Good night";
};
