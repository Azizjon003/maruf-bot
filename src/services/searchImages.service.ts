// export const searchImages = async (query: string, i: number = 1) => {
//   let data = await fetch(
//     `https://unsplash.com/ngetty/v3/search/images/creative?exclude_editorial_use_only=true&exclude_nudity=true&fields=display_set%2Creferral_destinations%2Ctitle&graphical_styles=photography&page_size=28&phrase=${query}&sort_order=best_match`,
//     {
//       headers: {
//         accept: "*/*",
//         "accept-language": "en-US",
//         "sec-ch-ua":
//           '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": '"Linux"',
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-origin",
//         cookie:
//           "require_cookie_consent=false; xp-semantic-search=control; _sp_ses.0295=*; uuid=405cb930-e535-11ee-bca3-7372f8ac6205; azk=405cb930-e535-11ee-bca3-7372f8ac6205; _sp_id.0295=14635c6f-3bdd-48ce-93d9-8f4ca9911b81.1710772737.1.1710774481..90bbdb32-9421-4541-b98c-b22989f324e2..ad41ea7b-6801-4cde-8877-eac584129d08.1710772737685.53",
//         Referer: "https://unsplash.com/s/photos/zoroastrianism",
//         "Referrer-Policy": "origin-when-cross-origin",
//       },
//       body: null,
//       method: "GET",
//     }
//   );

//   const response = await data.json();
//   console.log(response?.images);
//   let lenImg = response?.images[i]?.display_sizes.length;

//   let images =
//     lenImg >= 3
//       ? response?.images[i]?.display_sizes[2]?.uri
//       : response?.images[i]?.display_sizes[0]?.uri;
//   console.log(lenImg, "lenImgTwo");
//   if (!images) {
//     let data = await fetch(
//       `https://unsplash.com/ngetty/v3/search/images/creative?exclude_editorial_use_only=true&exclude_nudity=true&fields=display_set%2Creferral_destinations%2Ctitle&graphical_styles=photography&page_size=28&phrase=cyber_security&sort_order=best_match`,
//       {
//         headers: {
//           accept: "*/*",
//           "accept-language": "en-US",
//           "sec-ch-ua":
//             '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
//           "sec-ch-ua-mobile": "?0",
//           "sec-ch-ua-platform": '"Linux"',
//           "sec-fetch-dest": "empty",
//           "sec-fetch-mode": "cors",
//           "sec-fetch-site": "same-origin",
//           cookie:
//             "require_cookie_consent=false; xp-semantic-search=control; _sp_ses.0295=*; uuid=405cb930-e535-11ee-bca3-7372f8ac6205; azk=405cb930-e535-11ee-bca3-7372f8ac6205; _sp_id.0295=14635c6f-3bdd-48ce-93d9-8f4ca9911b81.1710772737.1.1710774481..90bbdb32-9421-4541-b98c-b22989f324e2..ad41ea7b-6801-4cde-8877-eac584129d08.1710772737685.53",
//           Referer: "https://unsplash.com/s/photos/zoroastrianism",
//           "Referrer-Policy": "origin-when-cross-origin",
//         },
//         body: null,
//         method: "GET",
//       }
//     );
//     const response = await data.json();
//     let lenImgTwo = response?.images[i]?.display_sizes.length;

//     console.log(lenImgTwo, "lenImgTwo");
//     images =
//       lenImgTwo >= 3
//         ? response?.images[i]?.display_sizes[2]?.uri
//         : response?.images[i]?.display_sizes[0]?.uri;
//   }

//   return images;
// };

interface DisplaySize {
  uri: string;
}

interface ImageResponse {
  images?: Array<{
    display_sizes?: DisplaySize[];
  }>;
}

const DEFAULT_HEADERS = {
  accept: "*/*",
  "accept-language": "en-US",
  "sec-ch-ua":
    '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Linux"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  cookie:
    "require_cookie_consent=false; xp-semantic-search=control; _sp_ses.0295=*",
  "Referrer-Policy": "origin-when-cross-origin",
};

const BASE_URL = "https://unsplash.com/ngetty/v3/search/images/creative";
const FALLBACK_QUERY = "cyber_security";

const createSearchUrl = (query: string) => {
  const params = new URLSearchParams({
    exclude_editorial_use_only: "true",
    exclude_nudity: "true",
    fields: "display_set,referral_destinations,title",
    graphical_styles: "photography",
    page_size: "28",
    phrase: query,
    sort_order: "best_match",
  });

  return `${BASE_URL}?${params.toString()}`;
};

const fetchImageData = async (query: string): Promise<ImageResponse | null> => {
  try {
    const response = await fetch(createSearchUrl(query), {
      headers: {
        ...DEFAULT_HEADERS,
        Referer: `https://unsplash.com/s/photos/${query}`,
      },
      method: "GET",
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const getImageUri = (
  images: ImageResponse["images"],
  index: number
): string => {
  // Xavfsiz tekshiruvlar
  if (!images || !Array.isArray(images) || !images[index]) {
    return "https://media.istockphoto.com/id/2148149010/photo/shah-i-zinda-samarkand-uzbekistan.jpg?a=1&b=1&s=612x612&w=0&k=20&c=axluvJXi7WKg_CvMizCfmf4Nw5LowPbjRu7rKBYun30=";
  }

  const displaySizes = images[index].display_sizes;
  if (
    !displaySizes ||
    !Array.isArray(displaySizes) ||
    displaySizes.length === 0
  ) {
    return "https://media.istockphoto.com/id/2148149010/photo/shah-i-zinda-samarkand-uzbekistan.jpg?a=1&b=1&s=612x612&w=0&k=20&c=axluvJXi7WKg_CvMizCfmf4Nw5LowPbjRu7rKBYun30=";
  }

  // Agar 3-rasm mavjud bo'lsa uni qaytarish, aks holda 1-rasmni
  return displaySizes.length >= 3 ? displaySizes[2].uri : displaySizes[0].uri;
};

export const searchImages = async (
  query: string,
  index: number = 1
): Promise<string> => {
  try {
    // Asosiy so'rov bilan urinish
    const response = await fetchImageData(query);
    if (response?.images) {
      const imageUri = getImageUri(response.images, index);
      if (imageUri) return imageUri;
    }

    // Agar topilmasa, zaxira so'rov bilan urinish
    const fallbackResponse = await fetchImageData(FALLBACK_QUERY);
    if (fallbackResponse?.images) {
      return getImageUri(fallbackResponse.images, index);
    }

    return "https://media.istockphoto.com/id/2148149010/photo/shah-i-zinda-samarkand-uzbekistan.jpg?a=1&b=1&s=612x612&w=0&k=20&c=axluvJXi7WKg_CvMizCfmf4Nw5LowPbjRu7rKBYun30=";
  } catch (error) {
    console.error("Error in searchImages:", error);
    return "https://media.istockphoto.com/id/2148149010/photo/shah-i-zinda-samarkand-uzbekistan.jpg?a=1&b=1&s=612x612&w=0&k=20&c=axluvJXi7WKg_CvMizCfmf4Nw5LowPbjRu7rKBYun30=";
  }
};

searchImages("Uzbekistan", 1).then(console.log);
