import axios from "axios";

import config from "data/config";

const BASE_URL = `${config.API_URL}api/suggestions`;

export const SuggestionService = {
  // create suggestion or return suggestion if exist
  create_suggestion: (lesson_id) =>
    axios.post(
      `${BASE_URL}/`,
      { lesson_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
  accept_content: (lesson_id) =>
    axios.put(
      `${BASE_URL}/`,
      { lesson_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
  // Method to revert content
  revert_content: (lesson_id) =>
    axios.put(
      `${BASE_URL}/revert/`,
      { lesson_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
  // Method to delete suggestion
  delete_suggestion: (lesson_id) =>
    axios.delete(`${BASE_URL}/`, {
      data: { lesson_id },
      headers: {
        "Content-Type": "application/json",
      },
    }),
};