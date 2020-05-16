spm_train \
    --input=../data/processed/AA/wiki_00 \
    --model_prefix=50k-jamonized --vocab_size=50000 \
    --max_sentence_length=5000000 \
    --normalization_rule_tsv=./normalization/nmt_nfkc_jamonized.tsv \
    --pad_id=0 --unk_id=1 --eos_id=-1 --bos_id=-1 \
    --control_symbols=[CLS],[SEP],[MASK] \
    --user_defined_symbols="(,),\",-,.,–,£,€" \
    --shuffle_input_sentence=true --input_sentence_size=100000 \
    --character_coverage=0.99995 --model_type=unigram