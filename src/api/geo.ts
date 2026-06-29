/** Reverse-geocode coordinates to a Persian district/neighbourhood name
 *  (e.g. "پونک", "انقلاب"). Uses OpenStreetMap's free Nominatim service.
 *  Returns null on any failure so callers can fall back. */
export async function reverseGeocodeDistrict(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
      `&lat=${lat}&lon=${lng}&zoom=14&accept-language=fa`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    const a = data?.address ?? {};
    return (
      a.neighbourhood ||
      a.suburb ||
      a.quarter ||
      a.city_district ||
      a.district ||
      a.town ||
      a.city ||
      null
    );
  } catch {
    return null;
  }
}
