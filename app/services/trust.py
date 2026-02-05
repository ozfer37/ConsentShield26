def calculate_trust(blink_count: int, emotion: str, panic: bool):
    if panic:
        return 0, "BLOCKED"

    score = 100

    if blink_count < 2:
        score -= 20

    if blink_count > 5:
        return max(score, 0), "FAILED"

    if emotion == "fear":
        score -= 30

    score = max(score, 0)

    if score >= 60:
        return score, "VERIFIED"
    else:
        return score, "FAILED"
