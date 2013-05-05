
TESTS=test/*.js
REPORTER=spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
    --require ./test/bootstrap \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov: lib-cov
	@QUANTUM_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov: clean
	@jscoverage lib lib-cov

clean:
	@rm -fr lib-cov
	@rm -f coverage.html

.PHONY: test test-cov lib-cov clean
