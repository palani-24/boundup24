export interface AICaptionResponse {
  caption: string;
  hashtags: string[];
}

export const generateAICaption = async (prompt: string, category: string): Promise<AICaptionResponse> => {
  // Creative rule-based AI generator for captions & hashtags
  const topic = prompt.trim() || category || 'Life';
  
  const captionTemplates = [
    `Capturing moments that matter ✨ ${topic} vibes hitting different today! What do you think?`,
    `Every detail counts. Stepping into ${topic} mode with full energy 🚀✨`,
    `Unfiltered views & pure ${topic} aesthetic. Keep scrolling for more! 📸🔥`,
    `Creating memories, one post at a time. Loving this ${topic} perspective! 💫`,
  ];

  const categoryHashtagsMap: Record<string, string[]> = {
    Photography: ['#photography', '#photooftheday', '#visualart', '#shotonmobile', '#framing', '#aesthetics'],
    Travel: ['#travelgram', '#wanderlust', '#explore', '#destination', '#travelphotography', '#adventure'],
    Food: ['#foodie', '#delicious', '#instafood', '#foodphotography', '#tasty', '#yummy'],
    Art: ['#art', '#artistsoninstagram', '#digitalart', '#design', '#creative', '#artwork'],
    Tech: ['#tech', '#innovation', '#future', '#developer', '#coding', '#gadgets'],
    Sports: ['#fitness', '#workout', '#sports', '#athlete', '#motivation', '#energy'],
    General: ['#boundup', '#trending', '#explore', '#content', '#viral', '#dailyvibes'],
  };

  const selectedCaption = captionTemplates[Math.floor(Math.random() * captionTemplates.length)];
  const tags = categoryHashtagsMap[category] || categoryHashtagsMap['General'];
  
  // Custom tag from prompt
  if (prompt) {
    const customTag = '#' + prompt.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!tags.includes(customTag)) {
      tags.unshift(customTag);
    }
  }

  return {
    caption: selectedCaption,
    hashtags: tags,
  };
};
