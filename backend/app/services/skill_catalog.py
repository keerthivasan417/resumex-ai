"""A small, versionable catalog of canonical technical skill names and aliases."""

from dataclasses import dataclass
import re


@dataclass(frozen=True)
class SkillDefinition:
    """A canonical skill and its accepted deterministic aliases."""

    name: str
    category: str
    aliases: tuple[str, ...]


SKILL_CATALOG: tuple[SkillDefinition, ...] = (
    SkillDefinition("Python", "language", ("python",)),
    SkillDefinition("JavaScript", "language", ("javascript", "js", "ecmascript")),
    SkillDefinition("TypeScript", "language", ("typescript", "ts")),
    SkillDefinition("React", "framework", ("react", "reactjs", "react.js")),
    SkillDefinition("FastAPI", "framework", ("fastapi", "fast api")),
    SkillDefinition("PostgreSQL", "database", ("postgresql", "postgres", "psql")),
    SkillDefinition("SQL", "database", ("sql",)),
    SkillDefinition("Docker", "platform", ("docker", "containers")),
    SkillDefinition("AWS", "cloud", ("aws", "amazon web services")),
    SkillDefinition("Git", "tool", ("git",)),
)


def _normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.casefold()).strip()


_ALIAS_INDEX = {
    _normalize(alias): definition
    for definition in SKILL_CATALOG
    for alias in definition.aliases
}


def normalize_skill(value: str) -> SkillDefinition | None:
    """Resolve a catalog name or alias to its canonical definition."""
    return _ALIAS_INDEX.get(_normalize(value))


def find_skill_definitions(text: str) -> list[SkillDefinition]:
    """Return each catalog skill mentioned in text once, in catalog order."""
    return [definition for definition in SKILL_CATALOG if _find_aliases(text, definition)]


def find_aliases(text: str, definition: SkillDefinition) -> list[str]:
    """Return non-overlapping aliases mentioned for one canonical skill."""
    return _find_aliases(text, definition)


def _find_aliases(text: str, definition: SkillDefinition) -> list[str]:
    matches: list[tuple[int, int, str]] = []
    for alias in sorted(definition.aliases, key=len, reverse=True):
        pattern = rf"(?<![A-Za-z0-9]){re.escape(alias)}(?![A-Za-z0-9])"
        matches.extend((match.start(), match.end(), match.group(0)) for match in re.finditer(pattern, text, re.IGNORECASE))

    accepted: list[tuple[int, int, str]] = []
    for match in sorted(matches, key=lambda item: (item[0], -(item[1] - item[0]))):
        if not any(match[0] < end and start < match[1] for start, end, _ in accepted):
            accepted.append(match)
    return [alias for _, _, alias in accepted]

