// utils/imageHelpers.ts
export function convertDriveLinkToEmbed(link: string): string {
  const match = link.match(/\/d\/([^/]+)\//);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : link;
}
