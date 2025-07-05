export function getNameInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  const func = (a: string[]) => a.map((word) => word[0].toUpperCase()).join("");

  if (parts.length === 0) {
    return "-";
  }

  if (parts.length >= 4) {
    return func(parts.slice(-2));
  }

  return func(parts);
}

export function getUserAvatar(user: Haivy.User) {
  const initial = getNameInitials(user.full_name || "-");

  const backup = `https://vsmrpwbcgkvznymcfuho.supabase.co/storage/v1/object/public/profile-images/profile_${user.user_id}.png`;

  const urls = [
    user.image_url,
    backup,
    `https://placehold.co/256/212b00/f1ffc4/?text=${initial}`,
  ];

  return urls.map((url) => `url('${url}')`).join(", ");
}
