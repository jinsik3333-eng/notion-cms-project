export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능
        'fix', // 버그 수정
        'docs', // 문서 변경
        'style', // 코드 스타일 변경 (포매팅, 세미콜론 등)
        'refactor', // 코드 리팩토링
        'perf', // 성능 개선
        'test', // 테스트 추가 또는 수정
        'chore', // 빌드, 의존성 등 변경
        'ci', // CI/CD 설정 변경
        'revert', // 이전 커밋 되돌림
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
