import json

from django.test import TestCase
from django.urls import reverse


class RecommendationAPITest(TestCase):

    def setUp(self):
        self.url = reverse(
            "recommendation_api:mood_recommendations"
        )

    def test_happy_mood(self):
        response = self.client.post(
            self.url,
            data=json.dumps({"mood": "Happy"}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data["mood"], "Happy")
        self.assertEqual(data["recommendation_count"], 10)
        self.assertEqual(len(data["recommendations"]), 10)

    def test_sad_mood(self):
        response = self.client.post(
            self.url,
            data=json.dumps({"mood": "Sad"}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["recommendation_count"],
            10
        )

    def test_relaxed_mood(self):
        response = self.client.post(
            self.url,
            data=json.dumps({"mood": "Relaxed"}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["recommendation_count"],
            10
        )

    def test_excited_mood(self):
        response = self.client.post(
            self.url,
            data=json.dumps({"mood": "Excited"}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["recommendation_count"],
            10
        )

    def test_romantic_mood(self):
        response = self.client.post(
            self.url,
            data=json.dumps({"mood": "Romantic"}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["recommendation_count"],
            10
        )

    def test_stressed_mood(self):
        response = self.client.post(
            self.url,
            data=json.dumps({"mood": "Stressed"}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["recommendation_count"],
            10
        )

    def test_invalid_mood(self):
        response = self.client.post(
            self.url,
            data=json.dumps({"mood": "Angry"}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["error"],
            "Invalid mood."
        )

    def test_missing_mood(self):
        response = self.client.post(
            self.url,
            data=json.dumps({}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["error"],
            "Mood is required."
        )

    def test_get_request_not_allowed(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(
            response.json()["error"],
            "Only POST requests are allowed."
        )