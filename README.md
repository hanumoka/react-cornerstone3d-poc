# React Cornerstone3D POC

Cornerstone3D를 활용한 DICOM 뷰어 성능 테스트 애플리케이션

## 프로젝트 개요

브라우저에서 여러 DICOM 파일을 동시에 로드하고 재생할 때의 성능을 테스트하기 위한 POC(Proof of Concept) 프로젝트입니다.

## 주요 기능

- 다중 그리드 레이아웃: 1×1, 2×2, 3×3, 4×3 형식의 뷰포트 배치
- 개별 재생/정지: 각 뷰포트를 독립적으로 재생/정지
- 전체 동시 재생/정지: 모든 뷰포트를 동시에 제어
- FPS 조정: 각 뷰포트의 재생 속도를 1-60 FPS로 조절
- 실시간 성능 모니터링: 로드된 이미지 수, 재생 중인 뷰포트 수 표시

## 시작하기

1. 의존성 설치: npm install
2. 개발 서버 실행: npm start
3. DICOM 파일 로드 및 그리드 레이아웃 선택
4. 재생 및 성능 테스트

## 프로젝트 구조

- src/components/: DicomViewport, GridLayout, FileLoader
- src/hooks/: useCinePlayer, useDicomLoader
- src/services/: cornerstoneService
