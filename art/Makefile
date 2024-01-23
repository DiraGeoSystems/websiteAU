SHELL=/bin/bash  # we're using bashisms in clean...

all: DiraGlobeSpec

DiraGlobeSpec: DiraGlobeSpec.pdf
DiraGlobeSpec.pdf: DiraGlobeSpec.mp DiraGlobeSpec.tex
	mpost DiraGlobeSpec.mp
	tex DiraGlobeSpec.tex
	dvipdfm DiraGlobeSpec.dvi

clean:
	rm -f DiraGlobeSpec.{dvi,log,mpx}
	rm -f DiraGlobeSpec*.mps

.PHONY: all clean
.PHONY: DiraGlobeSpec

