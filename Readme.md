# SentencePiece용 한국어 자모 분해 정규화 규칙 tsv

see [nmt_nfkc_jamonized.tsv](./normalization/nmt_nfkc_jamonized.tsv) and [korean_nfkc_to_nfkd.js](./normalization/korean_nfkc_to_nfkd.js)

기본적으로 SentencePiece의 NMT_NFKC 정규화를 하되, 한국어만 NFKD 정규화를 하는 커스텀 정규화 룰

## 이유

- 한글을 분리하기 위해
    - 한글은 표음문자 -> 음소문자 -> 자질문자입니다. 여러개의 알파벳이 하나로 합쳐져서 하나의 글자가 됩니다.
    - 하나의 유니코드 덩어리로 합쳐져버리면 알파벳이라는 특징을 활용할 수 없다고 생각했습니다.
    - 그래서 자모 단위로 처리할 수 있게 한글 호환 자모로 분리하면 되겠다고 생각했습니다.
    - 이런 짓을 한 사례가 없는 건 아닌데 다들 품질이 낮다고 하네요?
        - (1) [핑퐁](https://blog.pingpong.us/dialog-bert-tokenizer/)은 별도 명시가 없으니 BPE를 사용한 거 같고 (BPE vs Unigram LM은 아래 후술)
        - (2) [korean의 korean 체험기](https://if.kakao.com/2019/program?sessionId=89229809-2b80-471d-bb68-42beb7e0e166)는 슬라이드만 봐서는 뭘 어떻게 한 건지 알기가 어렵더라구요.
            - *(일 하는 것도 아닌데 굳이 동영상까진 보고싶지 않았습니다.)*
            - *(잡담: 나 저 날 갔는데 저거 안 봤어... 저 당시에 이 분야 전혀 몰라서...)*
- SentencePiece의 전처리를 거치면 한글이 합쳐짐
   - 유니코드 정규화 중 하나인 NFKC는 "compose" 이니만큼 한글을 유니코드 덩어리로 합쳐버립니다.
   - SentencePiece의 기본 정규화는 NFKC + 알파입니다. 즉, 한글을 아무리 분해해서 SPM한테 줘도 하나로 합쳐져서 나옵니다.
   - SentencePiece는 NF?D, 즉 유니코드 정규화 중 "decompose"를 지원하지 않습니다. 그리고 그게 제가 원하는 자모분해인거죠
   - 근데 정규화용 커스텀 룰은 지원합니다. 심지어 자동으로 생성된 샘플 TSV 파일도 제공합니다.
   - SPM 소스도 읽어봤는데요 성능 차이는 별로 없을 거 같더라구요. 내부적으로도 Dictionary 만들어서 처리하는 것 같아보였습니다.
- Unigram LM의 대안이 SentencePiece 외에는 찾기 어려움
   - 이유는 모르겠는데 다들 Unigram LM 놔두고 BPE만 열심히 하시더라구요. 성능이 더 나은 거 같아보이는데... [(1)](http://arxiv.org/abs/1804.10959)[(2)](http://arxiv.org/abs/2004.03720)
   - ALBERT 공식 공개 모델은 기본적으로 Unigram LM을 씁니다. 한국어 자모 단위 입력으로 ALBERT를 Unigram LM으로 적용하려면...(생략)

그래서 SentencePiece에서 제공하는 NMT_NFKC 룰을 수정하여, 정규화는 유지되되 한글만 호환 자모로 분리되는 커스텀 룰셋을 구성하였습니다.

## SentencePiece 사전

원래 목표는 한국어 ALBERT를 만들어보는 거였는데 그건 결국 못 했네요. 원래 관련 분야 연구자가 아닌데다 수학적 기반 지식이 아직 한참 모자르다보니...

아무튼 그 여파로 위키백과 덤프를 기반으로 한 50K 단어사전을 만들긴 했습니다. (30K가 아닌 이유는 "추측"에 의한 것입니다. 결국 성능을 못 냈으니까요.)

- 위키백과 데이터 - kowiki-20200420-pages-meta-current.xml ("현재" 버전만 있는 저 날짜 덤프)
- WikiExtractor 로컬 수정본 사용
    - 수정 부분 1: 토론 페이지 포함. 이상하게 다들 토론 페이지는 안 쓰시더라구요? 훌륭한 대화체 데이터일텐데.
    - 수정 부분 2: 뭐였더라 전처리 관련해서 XML 나오는 부분을 일부 없앴던 거 같은데말이죠
    - 원본 코드의 라이선스가 미기재 상태라 diff만 공개합니다. WikiExtractor.py 만 수정했으며 원본 커밋은 16186e290d9eb0eb3a3784c6c0635a9ed7e855c3