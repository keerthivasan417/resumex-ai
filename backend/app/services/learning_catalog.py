"""Small local, curated learning resources for deterministic skill-gap guidance."""

from dataclasses import dataclass


@dataclass(frozen=True)
class LearningResource:
    """A static recommendation; ResumeX never fetches this URL at recommendation time."""

    skill: str
    learning_path: tuple[str, ...]
    resource_title: str
    resource_url: str


LEARNING_CATALOG: dict[str, LearningResource] = {
    "Python": LearningResource("Python", ("syntax and data structures", "functions and modules", "testing"), "Python Tutorial", "https://docs.python.org/3/tutorial/"),
    "JavaScript": LearningResource("JavaScript", ("language fundamentals", "asynchronous programming", "modules"), "MDN JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"),
    "TypeScript": LearningResource("TypeScript", ("type system", "interfaces and generics", "project configuration"), "TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/intro.html"),
    "React": LearningResource("React", ("components and state", "effects", "application architecture"), "React Learn", "https://react.dev/learn"),
    "FastAPI": LearningResource("FastAPI", ("path operations", "Pydantic models", "dependency injection"), "FastAPI Tutorial", "https://fastapi.tiangolo.com/tutorial/"),
    "PostgreSQL": LearningResource("PostgreSQL", ("SQL fundamentals", "schema design", "indexes and query plans"), "PostgreSQL Tutorial", "https://www.postgresql.org/docs/current/tutorial.html"),
    "SQL": LearningResource("SQL", ("queries", "joins", "aggregation"), "SQLBolt Lessons", "https://sqlbolt.com/"),
    "Docker": LearningResource("Docker", ("images and containers", "Dockerfiles", "Compose"), "Docker Get Started", "https://docs.docker.com/get-started/"),
    "AWS": LearningResource("AWS", ("core services", "IAM", "deployment basics"), "AWS Getting Started", "https://aws.amazon.com/getting-started/"),
    "Git": LearningResource("Git", ("commits and branches", "merging", "collaboration workflows"), "Pro Git", "https://git-scm.com/book/en/v2"),
}


def learning_resource_for(skill_name: str) -> LearningResource | None:
    """Return the local curated entry for an existing canonical skill."""
    return LEARNING_CATALOG.get(skill_name)
