document.addEventListener('DOMContentLoaded', () => {
  const lenis = SmoothScroll.init();
  const nav = Navigation.init();
  nav.initScrollLinks(lenis);
  if (lenis) {
    lenis.on('scroll', nav.updateHeader);
  }

  Motion.init();

  const successModal = Modal.init('success-modal', ['modal-close', 'modal-confirm']);
  Modal.init('notice-modal', ['notice-close', 'notice-confirm']);

  document.getElementById('btn-notice')?.addEventListener('click', () => {
    Modal.open(document.getElementById('notice-modal'));
  });

  initForm(successModal);
});

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function validateForm() {
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  const birth = document.getElementById('birth');
  const privacy = document.getElementById('privacy');
  let valid = true;

  const setError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    if (msg) valid = false;
  };

  setError('error-name', '');
  setError('error-phone', '');
  setError('error-email', '');
  setError('error-birth', '');
  setError('error-privacy', '');

  if (!name?.value.trim()) setError('error-name', '이름을 입력해 주세요.');
  const phoneDigits = phone?.value.replace(/\D/g, '') || '';
  if (phoneDigits.length < 10) setError('error-phone', '올바른 휴대폰 번호를 입력해 주세요.');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email?.value || '')) setError('error-email', '올바른 이메일을 입력해 주세요.');
  const birthVal = birth?.value.replace(/\D/g, '') || '';
  if (birthVal.length !== 8) setError('error-birth', '생년월일 8자리를 입력해 주세요 (YYYYMMDD).');
  if (!privacy?.checked) setError('error-privacy', '개인정보 동의가 필요합니다.');

  return valid;
}

function initForm(successModal) {
  const form = document.getElementById('apply-form');
  const phoneInput = document.getElementById('phone');

  const birthInput = document.getElementById('birth');

  phoneInput?.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
  });

  birthInput?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '처리 중...';

    try {
      await SupabaseClient.submitApplication({
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value.trim(),
        birth: document.getElementById('birth').value,
        agree_privacy: document.getElementById('privacy').checked,
      });
      form.reset();
      successModal?.open();
    } catch (err) {
      console.error(err);
      alert('신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '카드 발급하고 혜택 받기';
    }
  });
}
